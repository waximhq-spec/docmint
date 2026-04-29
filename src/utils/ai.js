const FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

export async function generateWithAI(prompt, modelIndex = 0) {
  if (modelIndex >= FREE_MODELS.length) {
    return "AI generation failed. All models are currently busy. Please try again in a moment.";
  }

  const model = FREE_MODELS[modelIndex];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://docmint.app",
        "X-Title": "Docmint Agency Document Generator"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional creative agency assistant. Generate concise, structured, client-ready content. No conversational filler — just the output."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // If rate-limited or provider error, try next model automatically
    if (data.error?.code === 429 || data.error?.message?.includes("rate-limit") || data.error?.message?.includes("provider")) {
      console.warn(`Model ${model} rate-limited, trying next...`);
      return generateWithAI(prompt, modelIndex + 1);
    }

    if (!response.ok || data.error) {
      console.error("OpenRouter Error:", data.error);
      return "AI generation failed. Please try again.";
    }

    return data.choices?.[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "AI generation failed. Please check your connection and try again.";
  }
}
