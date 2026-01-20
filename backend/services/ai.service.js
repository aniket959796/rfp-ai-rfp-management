const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Safely extract JSON from LLM output
 */
function extractJson(text) {
  if (!text) {
    throw new Error("Empty AI response");
  }

  let cleaned = text.trim();

  // Remove markdown code fences if present
  cleaned = cleaned.replace(/```json/gi, "");
  cleaned = cleaned.replace(/```/g, "");
  cleaned = cleaned.trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI response");
  }

  const jsonString = cleaned.substring(start, end + 1);
  return JSON.parse(jsonString);
}

/**
 * Generate structured RFP using Groq LLM
 */
const generateStructuredRfp = async (userInput) => {
  const prompt = `
Convert the following procurement request into structured JSON.

RULES:
- Respond with VALID JSON only
- The response MUST start with { and end with }
- Do NOT use markdown
- Do NOT add explanations

Required fields:
- title
- items (array of { name, quantity, specs })
- budget
- deliveryDays
- paymentTerms
- warranty

Procurement request:
"${userInput}"
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const rawText = response.choices[0].message.content;
  const structured = extractJson(rawText);

  if (!structured?.items?.length) {
    throw new Error("AI failed to generate valid structured RFP");
  }

  return structured;
};

/**
 * Parse vendor email reply into structured proposal data
 */
const parseVendorReply = async (replyText) => {
  const prompt = `
You are extracting structured data from a VENDOR'S EMAIL RESPONSE.

IMPORTANT RULES:
- Extract values ONLY if explicitly mentioned by the vendor
- DO NOT use the RFP budget
- DO NOT infer or guess values
- Prices must come ONLY from the vendor reply
- Return numbers without currency symbols
- If a value is missing, return null
- Respond with VALID JSON ONLY
- The response MUST start with { and end with }

Expected JSON format:
{
  "totalPrice": number | null,
  "deliveryDays": number | null,
  "warranty": string | null,
  "paymentTerms": string | null,
  "notes": string | null
}

Vendor email reply:
"""
${replyText}
"""
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  return extractJson(response.choices[0].message.content);
};

/**
 * Get AI recommendation for best vendor
 */
const getBestVendorRecommendation = async (proposals) => {
  const prompt = `
You are an AI assistant evaluating vendor proposals for a procurement RFP.

Each proposal has:
- vendor (string)
- totalPrice (number)
- deliveryDays (number)
- warranty (string)
- paymentTerms (string)

Proposals:
${JSON.stringify(proposals, null, 2)}

Evaluation rules:
- Prefer lower total price
- Prefer faster delivery
- Prefer longer warranty
- Prefer reasonable payment terms
- Select ONE best vendor

Return ONLY valid JSON:

{
  "recommendedVendor": string,
  "reason": string
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  return extractJson(response.choices[0].message.content);
};

/**
 * Alternative recommendation helper (optional)
 */
const generateProposalRecommendation = async (proposals) => {
  const prompt = `
You are a procurement decision assistant.

Given the following vendor proposals, recommend the best vendor.

Return JSON only:
{
  "bestVendor": string,
  "reason": string
}

Proposals:
${JSON.stringify(proposals, null, 2)}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  return extractJson(response.choices[0].message.content);
};

module.exports = {
  generateStructuredRfp,
  parseVendorReply,
  getBestVendorRecommendation,
  generateProposalRecommendation,
};
