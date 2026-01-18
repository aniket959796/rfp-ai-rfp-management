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

  // Extract first valid JSON object
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
- Respond with JSON only
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
    temperature: 0.1,
    max_tokens: 800,
  });

  const rawText = response.choices[0].message.content;

  // SAFE JSON PARSING
  return extractJson(rawText);
};

const parseVendorReply = async (replyText) => {
  const prompt = `
You are a JSON extraction engine.

Extract the following fields from the vendor response.
If a value is missing, return null.

Return ONLY valid JSON. No explanation. No markdown.

{
  "totalPrice": number | null,
  "deliveryDays": number | null,
  "warranty": string | null,
  "paymentTerms": string | null,
  "notes": string | null
}

Vendor response:
${replyText}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content.trim();

  return JSON.parse(raw);
};
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

Return ONLY valid JSON (no markdown, no explanation):

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
  });

  const rawText = response.choices[0].message.content;

  // Reuse safe JSON extraction
  return extractJson(rawText);
};


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
  });

  return JSON.parse(response.choices[0].message.content);
};
module.exports = {generateProposalRecommendation,  getBestVendorRecommendation, parseVendorReply, generateStructuredRfp };
