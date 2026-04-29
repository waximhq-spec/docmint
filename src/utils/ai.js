export async function generateWithAI(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return "API Key not found. Please check your .env file.";
  }

  try {
    // Switching to gemini-pro for better compatibility with v1beta
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `AI Error: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI assistant.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "AI generation failed. Please check your connection and try again.";
  }
}
