import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { InfinitySpin } from "react-loader-spinner";

const ScreenShot = () => {
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const takeScreenshot = async () => {
    try {
      setIsLoading(true);
      const apiKey = "0de750";
      const apiUrl = `https://api.screenshotmachine.com?key=${apiKey}&url=${url}&dimension=1920x1080`;
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const base64Image = await arrayBufferToBase64(response.data);
      setScreenshot(base64Image);
    } catch (error) {
      console.error("Error taking screenshot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([buffer], { type: "image/png" }));
    });
  };

  const displayImage = () => {
    return (
      <div className="screenshot-img-container">
        <img
          src={`data:image/png;base64,${screenshot}`}
          alt="Screenshot"
          className="screenshot-img"
        />
      </div>
    );
  };

  const uploadToDrive = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/hello", data);
      alert(response.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScreenshot = () => {
    setUrl("");
    setScreenshot("");
  };

  return (
    <div className="screenshot-container">
      <input
        className="screenshot-input"
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="screenshot-btn" onClick={takeScreenshot}>
        Take Screenshot
      </button>
      <button
        className="screenshot-btn"
        onClick={() => uploadToDrive({ base64Image: screenshot })}
      >
        Upload to drive
      </button>
      <button className="screenshot-btn" onClick={resetScreenshot}>
        New
      </button>
      <div className="center-img">
        {isLoading ? (
          <InfinitySpin width="200" color="#0F2557" />
        ) : screenshot ? (
          displayImage()
        ) : (
          <Image
            src={"/no-photo.png"}
            width={150}
            height={150}
            alt="screenshot"
          />
        )}
      </div>
    </div>
  );
};

export default ScreenShot;
