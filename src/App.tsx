import React, { useState } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import FileUploader from "./components/FileUploader";
import LanguageSelector from "./components/LanguageSelector";
import { translateSrt } from "./utils/translateSrt";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [language, setLanguage] = useState("fr"); // Use language code, not the full name
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      setError("No file selected.");
      return;
    }
    try {
      const content = await file.text();
      setFileContent(content);
      console.log("Extracted File Content:", content);
    } catch (err) {
      console.error("Error extracting file content:", err);
      setError("Failed to read file content.");
    }
  };

  const handleApiKeyCheck = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      alert(response.ok ? "API Key is valid!" : "Invalid API Key.");
    } catch (err) {
      console.error("API Key check failed:", err);
      alert("Error checking API key.");
    }
  };

  const handleTranslation = async () => {
    setError("");
    if (!fileContent) {
      setError("No file uploaded for translation.");
      return;
    }

    try {
      console.log("Starting Translation...");
      const translated = await translateSrt(fileContent, apiKey, language);
      
      if (!translated) {
        throw new Error("Empty translation result.");
      }

      setTranslatedText(translated);
      console.log("Translation Response:", translated);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Translation failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">SRT Translator</Typography>
      
      <FileUploader onFileSelect={handleFileUpload} />
      
      {fileContent && (
        <>
          <Typography variant="h6">Extracted File Content:</Typography>
          <pre>{fileContent}</pre>
        </>
      )}

      <TextField
        label="OpenAI API Key"
        fullWidth
        margin="normal"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <Button variant="contained" onClick={handleApiKeyCheck} style={{ marginBottom: 10 }}>
        Check API Key
      </Button>

      <LanguageSelector language={language} setLanguage={setLanguage} />

      <Button variant="contained" onClick={handleTranslation} style={{ marginTop: 20 }}>
        Translate
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {translatedText && (
        <>
          <Typography variant="h6">Translated Text:</Typography>
          <pre>{translatedText}</pre>
        </>
      )}
    </div>
  );
};

export default App;
