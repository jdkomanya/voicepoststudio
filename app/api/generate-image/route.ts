import { NextResponse } from "next/server";
import OpenAI from "openai";
import { IMAGE_SIZE, OPENAI_IMAGE_MODEL } from "@/lib/openai-config";

type ImageRequest = {
  postText?: string;
  platform?: string;
  visualStyle?: string;
  lmicContext?: string;
  imageConcept?: string;
  avoidList?: string;
};

function buildPrompt(body: ImageRequest) {
  const negativePrompt =
    body.avoidList ||
    "Avoid generic Western hospital imagery, futuristic robots, sci-fi dashboards, fake medical devices, incorrect audiology tool placement, unnecessary headphones on clinicians, spelling errors, repeated words, fake badges, invented names, and disrespectful patient representation.";

  const prompt = `Create one square realistic social media image for ${body.platform || "social media"}.
Visual style: ${body.visualStyle || "Realistic clinic photo"}.
LMIC context: ${body.lmicContext || "Tanzania"}.
Post text to support: ${body.postText || "A professional public health social media post."}.
Image concept: ${body.imageConcept || "A grounded, professional African public health or education scene."}

Image requirements:
- Strongly preserve African and LMIC context when relevant.
- Show realistic clinic, school, university, home, outreach, public health, or community environments where appropriate.
- If audiology is involved, show realistic hearing assessment, counselling, otoscopy, hearing aid fitting, screening, awareness education, or community health interaction.
- Use natural lighting, realistic clothing, respectful posture, and accurate equipment.
- Minimal text on the image. No invented logos or names unless supplied by the user.
- 1:1 square composition, suitable for a social post.

Avoid: ${negativePrompt}`;

  return { prompt, negativePrompt };
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is missing. Add it to your environment variables and restart the app." }, { status: 500 });
    }

    const body = (await request.json()) as ImageRequest;
    if (!body.postText && !body.imageConcept) {
      return NextResponse.json({ error: "Add post text or an image concept before generating an image." }, { status: 400 });
    }

    const { prompt, negativePrompt } = buildPrompt(body);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const image = await client.images.generate({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      size: IMAGE_SIZE as "1024x1024",
      quality: "medium",
      n: 1
    });

    const first = image.data?.[0] as { b64_json?: string; url?: string } | undefined;
    const imageBase64 = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : undefined;

    return NextResponse.json({
      imageBase64,
      imageUrl: first?.url,
      imagePromptUsed: prompt,
      negativePrompt
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while generating the image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
