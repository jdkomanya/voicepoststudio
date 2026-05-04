import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OPENAI_TEXT_MODEL } from "@/lib/openai-config";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalPost: { type: "string" },
    alternativeHooks: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
    ctaOptions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
    platformVersion: { type: "string" },
    hashtags: {
      type: "object",
      additionalProperties: false,
      properties: {
        broad: { type: "array", items: { type: "string" } },
        niche: { type: "array", items: { type: "string" } },
        local: { type: "array", items: { type: "string" } },
        engagement: { type: "array", items: { type: "string" } }
      },
      required: ["broad", "niche", "local", "engagement"]
    },
    imageConcept: { type: "string" }
  },
  required: ["finalPost", "alternativeHooks", "ctaOptions", "platformVersion", "hashtags", "imageConcept"]
} as const;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is missing. Add it to your environment variables and restart the app." }, { status: 500 });
    }

    const body = await request.json();
    if (!body.topic || !body.platform || !body.audience) {
      return NextResponse.json({ error: "Please add a topic, platform, and audience before generating a post." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: OPENAI_TEXT_MODEL,
      temperature: 0.75,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "voice_post_generation",
          schema,
          strict: true
        }
      },
      messages: [
        {
          role: "system",
          content:
            "You are VOICE Post Studio. Generate high-quality first-person social posts using VOICE: View, Observation, Insight, Craft, Engage. Preserve LMIC and African context with care, especially healthcare, public health, education, audiology, and community settings. Never use em dashes. Avoid generic advice. Use one clear idea. End with a direct question or CTA."
        },
        {
          role: "user",
          content: `Create a ${body.platform} post with this brief:
Topic: ${body.topic}
Goal: ${body.goal}
Audience: ${body.audience}
My lived experience or observation: ${body.observation || "Not provided"}
My belief or view: ${body.view || "Not provided"}
What I am building, doing, testing, advocating, or promoting: ${body.craft || "Not provided"}
Tone: ${body.tone}
CTA preference: ${body.ctaPreference || "Relevant engagement question"}
Location/context: ${body.context}
Keywords to include: ${body.keywords || "None"}
Words to avoid: ${body.avoidWords || "None"}

Rules:
- Use first-person language.
- Structure the final post through View, Observation, Insight, Craft, Engage without labeling every section.
- For Facebook and Instagram hashtags, return broad, niche, local/context, and engagement groups with 15 total hashtags maximum.
- For LinkedIn, keep hashtags fewer and highly relevant.
- Make the image concept realistic, respectful, and LMIC-aware.`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("The model returned an empty response.");

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while generating the post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
