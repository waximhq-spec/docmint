export async function generateWithAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://docmint.app",
      "X-Title": "Docmint Agency Document Generator"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini:free",
      messages: [
        {
          role: "system",
          content: "You are a professional creative agency assistant specializing in document generation. Generate concise, client-ready content with no extra commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter Error:", data);
    return "AI generation failed. Please try again.";
  }

  return data.choices?.[0]?.message?.content || "No response from AI";
}
