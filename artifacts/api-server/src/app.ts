import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Trust reverse proxy (Render's proxy) so req.secure works correctly in production
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
// cookie-parser must be initialized with SESSION_SECRET so signed cookies work in production
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve the built React frontend
// __dirname is injected by the esbuild banner: artifacts/api-server/dist/
// So ../../../artifacts/alberuni/dist/public resolves to the repo-root frontend build
const __dirnameEsm = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST =
  process.env.FRONTEND_DIST ??
  path.join(__dirnameEsm, "..", "..", "..", "artifacts", "alberuni", "dist", "public");

app.use(express.static(FRONTEND_DIST));

// SPA fallback: serve index.html for all non-API routes so React Router works
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

export default app;
