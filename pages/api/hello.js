import { google } from "googleapis";
import stream from "stream";
import fs from "fs";

const apiKeys = require("./apiKey.json");

const SCOPE = ["https://www.googleapis.com/auth/drive"];

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    apiKeys.client_email,
    null,
    apiKeys.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
};

const convertBase64ToImage = (base64Data, outputPath) => {
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Image, "base64");
  fs.writeFileSync(outputPath, buffer, "binary");
  return outputPath;
};

const uploadFile = async (authClient, filePath) => {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    const fileMetadata = {
      name: "",
      parents: ["1CRNxvt9QAVA7eWxqZR4NBvDSvgMNhHCD"],
    };

    const media = {
      mimeType: "image/png",
      body: fs.createReadStream(filePath),
    };

    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      }
    );
  });
};

export default async function handler(req, res) {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(200).json({ message: "Image is Required" });
    }
    const tempImagePath = convertBase64ToImage(base64Image, "temp_image.png");

    const authClient = await authorize();
    const uploadedFile = await uploadFile(authClient, tempImagePath);

    fs.unlinkSync(tempImagePath);

    res
      .status(200)
      .json({ message: "File uploaded successfully", fileId: uploadedFile.id });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
