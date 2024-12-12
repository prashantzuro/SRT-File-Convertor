// src/components/LanguageSelector.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Language } from '../types';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Target Language</InputLabel>
      <Select
        value={language}
        label="Target Language"
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="de">German</MenuItem>
        <MenuItem value="it">Italian</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;