# VOICE Post Studio

VOICE Post Studio is a Next.js App Router MVP for generating VOICE Framework social posts and realistic LMIC-aware social media images with OpenAI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Optional model overrides:

```bash
OPENAI_TEXT_MODEL=gpt-4.1-mini
OPENAI_IMAGE_MODEL=gpt-image-1
```

3. Run locally:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Vercel Deployment

1. Push this project to GitHub.
2. Import it in Vercel.
3. Add `OPENAI_API_KEY` in Vercel Project Settings under Environment Variables.
4. Deploy with the default Next.js settings.

## Changing The Image Model

The image model is configured in `lib/openai-config.ts`.

Update:

```ts
export const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
```

You can also set `OPENAI_IMAGE_MODEL` in `.env.local` or in Vercel environment variables.

## Troubleshooting

- Missing key: confirm `OPENAI_API_KEY` exists in `.env.local`, then restart the dev server.
- Empty post fields: add at least a topic, platform, and audience.
- Image generation fails: confirm your OpenAI account has image generation access and the configured image model is available.
- Drafts missing: saved drafts use browser `localStorage`, so they are tied to the current browser and device.

## Safety Notes

All OpenAI requests run through server API routes:

- `app/api/generate-post/route.ts`
- `app/api/generate-image/route.ts`

The API key is never sent to frontend code.
