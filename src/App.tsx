import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Snackbar, 
  Alert, 
  Button, 
  Typography, 
  Box,
  Divider,
  LinearProgress,
  Stack
} from '@mui/material';
import FileUploader from './components/FileUploader';
import LanguageSelector from './components/LanguageSelector';
import { Language } from './types';
import { readFileAsText } from './utils/fileHelper';

const API_URL = 'http://127.0.0.1:8000/translate';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language>('es');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    console.log('File selected:', selectedFile.name);
  };

  const translateText = async (content: string, targetLanguage: string) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        target_language: targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();
    return data.translated_text; // Adjust this based on your API response structure
  };

  const handleTranslate = async () => {
    if (!file) {
      setError('Please provide a file');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Read file content
      const fileContent = await readFileAsText(file);
      
      // Translate content using local API
      const translatedContent = await translateText(fileContent, language);
      
      // Create and download the translated file
      const blob = new Blob([translatedContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translated_${file.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
          <Typography variant="h5" component="h1">
            SRT File Translator
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Translate your subtitle files to any language
          </Typography>
        </Box>

        {/* Main Content */}
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* File Upload Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              1. Upload SRT File
            </Typography>
            <FileUploader onFileSelect={handleFileSelect} />
            {file && (
              <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                ✓ Selected file: {file.name}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Language Selection Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              2. Select Target Language
            </Typography>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </Box>

          {/* Translation Button */}
          <Button
            size="large"
            fullWidth
            variant="contained"
            onClick={handleTranslate}
            disabled={loading || !file}
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Translating...' : 'Start Translation'}
          </Button>

          {/* Progress Indicator */}
          {loading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Translation Progress: {progress}%
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;