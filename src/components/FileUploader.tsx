// src/components/FileUploader.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper } from '@mui/material';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('File dropped:', file.name); // Debug log
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/srt': ['.srt'] },
    multiple: false
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        mb: 2,
        border: '2px dashed #ccc',
        cursor: 'pointer',
        '&:hover': { borderColor: 'primary.main' }
      }}
    >
      <input {...getInputProps()} />
      <Typography align="center">
        {isDragActive
          ? "Drop the SRT file here"
          : "Drag and drop an SRT file here, or click to select"}
      </Typography>
    </Paper>
  );
};

export default FileUploader;