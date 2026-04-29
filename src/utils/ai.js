const MODELS = [
  "openai/gpt-oss-120b:free",
  "minimax/minimax-m2.5:free"
];

export async function generateWithAI(prompt) {
  for (const model of MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
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

      if (response.ok && data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      
      console.warn(`Model ${model} failed or busy, trying next...`);
    } catch (err) {
      console.error("Model connection failed:", model, err);
    }
  }

  return "AI unavailable. Using default template.";
}
