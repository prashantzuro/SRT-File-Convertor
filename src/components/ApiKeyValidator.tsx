import React, { useState } from "react";
import { Button, Typography } from "@mui/material";

interface Props {
  apiKey: string;
}

const ApiKeyValidator: React.FC<Props> = ({ apiKey }) => {
  const [valid, setValid] = useState<string | null>(null);

  const validateApiKey = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      setValid(response.ok ? "Valid" : "Invalid");
    } catch {
      setValid("Invalid");
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={validateApiKey}>
        Check API Key
      </Button>
      {valid && <Typography>{valid} API Key</Typography>}
    </div>
  );
};

export default ApiKeyValidator;
