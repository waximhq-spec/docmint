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
              content: "You are a professional creative agency assistant. Generate content that is clean, structured, and easy to read. Use bullet points for lists. Avoid excessive Markdown symbols like triple asterisks. Use double asterisks for bold headers only. No conversational filler."
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
        // Post-process to remove triple asterisks or strange AI formatting artifacts
        let content = data.choices[0].message.content;
        content = content.replace(/\*\*\*/g, '**'); // Convert *** to **
        return content.trim();
      }
      
      console.warn(`Model ${model} failed or busy, trying next...`);
    } catch (err) {
      console.error("Model connection failed:", model, err);
    }
  }

  return "AI unavailable. Using default template.";
}
