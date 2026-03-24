import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

export function saveBase64Image(base64String: string): string | null {
  if (!base64String || base64String.trim() === "") {
    return null;
  }

  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const matches = base64String.match(/^data:image\/(\w+);base64,/);
  const extension = matches ? matches[1] : "jpg";

  const fileName = `exercise-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
}
