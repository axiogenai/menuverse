/**
 * Groq LPU Ultra-Fast LLM Inference Client
 * Model: llama-3.3-70b-versatile / llama-3.1-8b-instant
 */

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function queryGroq(
  messages: GroqMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormatJson?: boolean;
  } = {}
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = options.model || "qwen/qwen3.8-27b";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 1024,
        ...(options.responseFormatJson ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Groq API Error:", res.status, err);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("Groq inference fetch error:", err);
    return null;
  }
}

/**
 * Generate Real Dish Summary with Llama 3.3 on Groq
 */
export async function generateGroqDishSummary(
  dishName: string,
  reviews: Array<{ authorName?: string; text?: string; rating: number }>
) {
  const reviewsText = reviews
    .map((r, i) => `[Review ${i + 1}] Rating: ${r.rating}★ | "${r.text || "No text"}"`)
    .join("\n");

  const systemPrompt = `You are an executive culinary critic and luxury dining consultant for "Hotel Gypsy". 
Analyze customer reviews for "${dishName}" and return a structured JSON response matching this schema:
{
  "summaryText": "2-3 sentences summarizing diner consensus, taste highlights, and texture.",
  "positiveHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "improvementSuggestions": ["Suggestion 1 (if any, otherwise leave empty)"],
  "flavorProfile": ["flavor 1", "flavor 2", "flavor 3"],
  "recommendedPairing": "Beverage or side dish pairing"
}
Keep it authentic, concise, and professional. Return ONLY the JSON object.`;

  const userPrompt = `Dish: ${dishName}\nCustomer Reviews:\n${reviewsText || "No written reviews yet."}`;

  const response = await queryGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { responseFormatJson: true, temperature: 0.2 }
  );

  if (!response) return null;

  try {
    return JSON.parse(response);
  } catch (e) {
    console.error("Failed to parse Groq JSON response", e);
    return null;
  }
}

/**
 * Generate Intelligent Owner Reply for Diner Review using Groq
 */
export async function generateGroqOwnerReply(
  reviewerName: string,
  reviewText: string,
  rating: number
): Promise<string | null> {
  const systemPrompt = `You are the General Manager of Hotel Gypsy, a prestigious luxury dining palace known for authentic regional delicacies and royal hospitality.
Draft a gracious, personalized, and authentic owner response to a diner's review.
- If rating is 4-5 stars: Warmly thank them, reference specifics they enjoyed, and invite them back.
- If rating is 1-3 stars: Acknowledge their feedback humbly, apologize for shortcomings, emphasize commitment to quality, and offer to make things right.
- Keep the response between 2 to 4 sentences. Sound genuinely human, hospitable, and warm.`;

  const userPrompt = `Diner Name: ${reviewerName}
Rating: ${rating} / 5 Stars
Review: "${reviewText}"`;

  return await queryGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.5, maxTokens: 300 }
  );
}
