const FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

export async function generateWithAI(prompt, modelIndex = 0) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return "Error: API Key missing. Please restart your dev server.";
  }

  if (modelIndex >= FREE_MODELS.length) {
    return "AI Error: All free models are currently busy. Please wait 30 seconds and try again.";
  }

  const model = FREE_MODELS[modelIndex];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://docmint.app",
        "X-Title": "Docmint"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional creative agency assistant. Generate concise, structured, client-ready content. No conversational filler."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // Handle OpenRouter-specific rate limits or provider errors by trying next model
    if (data.error?.code === 429 || data.error?.code === 408 || data.error?.message?.includes("rate") || data.error?.message?.includes("provider")) {
      console.warn(`Model ${model} busy, trying fallback...`);
      return generateWithAI(prompt, modelIndex + 1);
    }

    if (!response.ok) {
      return `AI Error: ${data.error?.message || response.statusText}`;
    }

    return data.choices?.[0]?.message?.content || "AI returned an empty response. Please try again.";
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return "AI Connection failed. Check your internet or API key.";
  }
}
