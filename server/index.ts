import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import type { AddressInfo } from "net";

async function pingSearchEngines() {
  if (process.env.NODE_ENV !== "production") return;

  const siteUrl = process.env.PUBLIC_SITE_URL || "https://enalcaccia-treviso.replit.app";
  const sitemapUrl = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  const feedUrl = `${siteUrl.replace(/\/$/, "")}/feed.xml`;

  const pingUrls = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  for (const pingUrl of pingUrls) {
    try {
      const response = await fetch(pingUrl, { method: "GET" });
      log(`SEO ping ${pingUrl} -> ${response.status}`);
    } catch (error) {
      log(`SEO ping failed for ${pingUrl}`);
    }
  }

  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) return;

  try {
    const hostname = new URL(siteUrl).hostname;
    const indexNowPayload = {
      host: hostname,
      key: indexNowKey,
      keyLocation: `${siteUrl.replace(/\/$/, "")}/${indexNowKey}.txt`,
      urlList: [
        `${siteUrl.replace(/\/$/, "")}/`,
        sitemapUrl,
        feedUrl,
      ],
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(indexNowPayload),
    });

    log(`IndexNow ping -> ${response.status}`);
  } catch (_error) {
    log("IndexNow ping failed");
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached assets statically
app.use('/attached_assets', express.static('attached_assets'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // In development, start from 5001 and auto-increment if the port is busy.
  // In production, keep default 5000 unless PORT is explicitly provided.
  const defaultPort = app.get("env") === "development" ? 5001 : 5000;
  const hasExplicitPort = Boolean(process.env.PORT);
  const initialPort = Number(process.env.PORT || defaultPort);

  const tryListen = (port: number) => {
    server.once("error", (error: NodeJS.ErrnoException) => {
      const isDevAutoFallback = !hasExplicitPort && app.get("env") === "development";
      if (error.code === "EADDRINUSE" && isDevAutoFallback) {
        log(`port ${port} in use, trying ${port + 1}`);
        tryListen(port + 1);
        return;
      }
      throw error;
    });

    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      server.removeAllListeners("error");
      const address = server.address() as AddressInfo | null;
      log(`serving on port ${address?.port ?? port}`);
      void pingSearchEngines();
    });
  };

  tryListen(initialPort);
})();
