
export const getMealEstimation = async (mealType: string, count: number, menuItems: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error("Gemini API Key is missing");
    throw new Error("Missing API Key. Check VITE_GEMINI_API_KEY in .env.local and restart server.");
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    const prompt = `Suggest quantity for ${count} students for a ${mealType} meal consisting of: ${menuItems}. 
    Provide results in a JSON format with this structure:
    {
      "estimates": [
        { "item": "string", "quantity": "string", "unit": "string", "wastageBuffer": "string" }
      ],
      "totalWastageEstimation": "string",
      "notes": "string"
    }
    IMPORTANT: Return ONLY the raw JSON string, no markdown formatting.`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // API V1 requires snake_case for field names
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("AI returned empty response.");

    // Clean potential markdown blocks if API ignores instruction
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Failed to generate prediction. Check network or API Key.");
  }
};
