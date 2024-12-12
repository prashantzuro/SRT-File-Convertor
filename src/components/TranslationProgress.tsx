// src/components/TranslationProgress.tsx
import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

interface TranslationProgressProps {
  progress: number;
  isLoading: boolean;
}

const TranslationProgress: React.FC<TranslationProgressProps> = ({ progress, isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mb: 1 }}
      />
      <Typography variant="body2" color="text.secondary" align="center">
        {`Translation Progress: ${Math.round(progress)}%`}
      </Typography>
    </Box>
  );
};

export default TranslationProgress;