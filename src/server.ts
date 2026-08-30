import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routers/routers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = process.env.PORT || 3000;

server.use(helmet());
server.use(express.json());

server.use(express.static(path.join(__dirname, "..", "public")));

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

server.use(router);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
