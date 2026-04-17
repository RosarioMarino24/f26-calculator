import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.json());

  // API: PDF-Generierung (MUSS vor static middleware registriert sein)
  app.post("/api/generate-contract", async (req, res) => {
    try {
      const { gesetzlicherVertreter, kundenAdresse, signatureImage } = req.body;
      
      // Rufe Python-Skript auf
      const pythonScript = path.resolve(__dirname, "..", "generate-contract.py");
      const data = JSON.stringify({
        gesetzlicherVertreter,
        kundenAdresse
      });
      
      const pdfPath = execSync(`python3 ${pythonScript} '${data.replace(/'/g, "'\\''")}' 2>&1`, {
        encoding: "utf-8",
        timeout: 30000
      }).trim();
      
      if (!fs.existsSync(pdfPath)) {
        return res.status(500).json({ error: "PDF konnte nicht generiert werden" });
      }
      
      // Sende PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="F26-Vertrag-${gesetzlicherVertreter}.pdf"`);
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
      
      // Lösche temporäre Datei nach dem Senden
      fileStream.on("end", () => {
        try {
          fs.unlinkSync(pdfPath);
        } catch (e) {
          console.error("Fehler beim Löschen der temporären Datei:", e);
        }
      });
    } catch (error) {
      console.error("PDF-Generierung fehlgeschlagen:", error);
      res.status(500).json({ error: "PDF-Generierung fehlgeschlagen" });
    }
  });

  // Serve static files NACH API-Endpoints
  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`PDF-API verfügbar unter /api/generate-contract`);
  });
}

startServer().catch(console.error);
