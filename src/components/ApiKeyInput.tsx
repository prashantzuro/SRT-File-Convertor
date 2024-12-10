import React from 'react';
import { TextField } from '@mui/material';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => (
  <TextField
    label="OpenAI API Key"
    fullWidth
    margin="normal"
    value={apiKey}
    onChange={(e) => setApiKey(e.target.value)}
  />
);

export default ApiKeyInput;
