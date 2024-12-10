import React from "react";
import { Button } from "@mui/material";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file); // Handle null case
  };

  return (
    <div>
      <input
        type="file"
        accept=".srt"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          Upload SRT File
        </Button>
      </label>
    </div>
  );
};

export default FileUploader;
