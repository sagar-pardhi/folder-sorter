import fs from "node:fs/promises";
import path from "node:path";

const FILE_EXTENSIONS = {
  Images: [
    ".jpg",
    ".jpeg",
    ".jpe",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
    ".ico",
  ],
  Videos: [
    ".webm",
    ".mpeg",
    ".ogg",
    ".mp4",
    ".avi",
    ".wmv",
    ".mov",
    ".qt",
    ".flv",
  ],
  Audio: [".flac", ".mp3", ".wav"],
  Documents: [
    ".doc",
    ".docs",
    ".docx",
    ".xls",
    ".xlsx",
    ".pdf",
    ".ppt",
    ".pptx",
    ".txt",
  ],
  Programs: [".exe", ".msi"],
  Compressed: [".zip", ".rar", ".7z"],
};

const CURRENT_DIR = process.argv[2] || "./";

function findExtension(file) {
  const fileExtension = path.extname(file);
  const [folderName] =
    Object.entries(FILE_EXTENSIONS).find(([, extensions]) =>
      extensions.includes(fileExtension)
    ) || [];
  return folderName;
}

async function createFolder(folder) {
  try {
    await fs.mkdir(folder, { recursive: true });
  } catch (error) {
    console.error("Unable to create folder", error);
  }
}

async function moveFile(destination, file) {
  const sourcePath = path.resolve(CURRENT_DIR, file);
  const destinationPath = path.resolve(destination, file);

  try {
    await fs.rename(sourcePath, destinationPath);
    console.log(`${file} moved to ${destinationPath}`);
  } catch (error) {
    console.error("Unable to move file: ", error);
  }
}

async function readFolder() {
  try {
    const files = await fs.readdir(CURRENT_DIR);

    for (const file of files) {
      const destination = findExtension(file);
      if (destination) {
        const destinationPath = path.resolve(CURRENT_DIR, destination);

        await createFolder(destinationPath);
        await moveFile(destinationPath, file);
      }
    }
  } catch (error) {
    console.error("Unable to scan directory", error);
  }
}

readFolder();
