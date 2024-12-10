export const translateSrt = async (
  fileContent: string,
  apiKey: string,
  language: string
): Promise<string | null> => {
  const maxRetries = 10; // Increased max retries
  let retryDelay = 2000; // Initial delay is 2 seconds
  let retryCount = 0;

  // Keep trying until the max retry limit is reached
  while (retryCount < maxRetries) {
    try {
      console.log("Sending translation request...");

      // Send the translation request
      let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an SRT translator. Translate the following subtitles to ${language}:`,
            },
            { role: "user", content: fileContent },
          ],
        }),
      });

      // Check for 429 Rate Limit Exceeded response
      while (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        let waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : retryDelay;
        
        // Log and apply wait time from Retry-After or fallback delay
        console.warn(`Rate limit exceeded. Retrying in ${waitTime / 1000} seconds...`);

        await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait before retrying
        retryDelay *= 2; // Exponential backoff: double the delay for the next retry
        retryCount++;

        // Retry the request after the delay
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an SRT translator. Translate the following subtitles to ${language}:`,
              },
              { role: "user", content: fileContent },
            ],
          }),
        });

        // If retry count exceeds max retries, throw an error
        if (retryCount >= maxRetries) {
          console.error("Max retries exceeded for rate limit.");
          throw new Error("Rate limit exceeded.");
        }
      }

      // Handle response if status is not 429
      if (!response.ok) {
        console.error("API Request Failed:", response.statusText);
        throw new Error(`API Request failed with status ${response.status}`);
      }

      // Parse the API response
      const data = await response.json();
      console.log("Full API Response:", data);

      const translatedText = data?.choices?.[0]?.message?.content || null;

      // Display the translated text to verify the response
      if (translatedText) {
        console.log("Translation Success:", translatedText);
        return translatedText;
      } else {
        console.error("No translation found in the response.");
        throw new Error("No translation found in the response.");
      }

    } catch (error) {
      console.error("Translation Error:", error);

      // If max retries are reached, throw an error
      if (retryCount === maxRetries - 1) {
        throw new Error("Max retries reached. Translation failed.");
      }
    }
  }

  return null; // If all retries fail
};
