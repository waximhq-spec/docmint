const MODELS = [
  "openai/gpt-oss-120b:free",
  "minimax/minimax-m2.5:free"
];

/**
 * Strips all markdown-style formatting symbols (**, *, ###, etc.)
 * to provide perfectly clean text for textareas.
 */
function cleanFormatting(text) {
  if (!text) return "";
  return text
    .replace(/\*\*\*/g, "") // Remove triple stars
    .replace(/\*\*/g, "")    // Remove double stars (bold)
    .replace(/\*/g, "")      // Remove single stars (italic)
    .replace(/###/g, "")     // Remove H3
    .replace(/##/g, "")      // Remove H2
    .replace(/#/g, "")       // Remove H1
    .replace(/__/g, "")      // Remove double underscores
    .replace(/`/g, "")       // Remove backticks
    .trim();
}

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
              content: "You are a professional creative agency assistant. Your ONLY job is to polish, refine, or rewrite the text provided by the user. Do NOT add new ideas, do NOT expand the scope, and do NOT add conversational filler. Provide PLAIN TEXT ONLY. Do not use any markdown formatting, asterisks, or bold symbols. Keep the output concise, clean, and client-ready."
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
        // Return perfectly cleaned text
        return cleanFormatting(data.choices[0].message.content);
      }
      
      console.warn(`Model ${model} failed or busy, trying next...`);
    } catch (err) {
      console.error("Model connection failed:", model, err);
    }
  }

  return "AI unavailable. Please try again.";
}
