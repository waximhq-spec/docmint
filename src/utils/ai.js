export async function generateWithAI(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return "AI Error: " + (data.error?.message || "Unknown error");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
}
