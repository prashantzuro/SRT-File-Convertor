import React from 'react';
import { Select, MenuItem } from '@mui/material';

interface LanguageSelectorProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => (
  <Select fullWidth value={language} onChange={(e) => setLanguage(e.target.value)}>
    <MenuItem value="es">Spanish</MenuItem>
    <MenuItem value="fr">French</MenuItem>
    <MenuItem value="de">German</MenuItem>
    <MenuItem value="it">Italian</MenuItem>
  </Select>
);

export default LanguageSelector;
