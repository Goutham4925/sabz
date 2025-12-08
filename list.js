import fs from "fs";
import path from "path";

function listFilesRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    // Skip node_modules
    if (file === "node_modules") continue;

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      listFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// Usage
const root = "./"; // your route directory
const allFiles = listFilesRecursive(root);

console.log(allFiles);
