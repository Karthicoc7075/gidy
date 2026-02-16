import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/lib/db/dbConnect";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(req: NextRequest) {
  await connectDB();

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);

  const prompt = `
You are a professional bio writer. Create a compelling, professional bio (2-3 sentences, ~50-75 words) that sounds natural and engaging.

Profile Information:
- Name: ${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Professional'}
- Current Role/Title: ${user.descriptionType || 'Professional'}
- Core Skills: ${user.skills?.join(", ") || 'Not specified'}
- Career Aspiration: ${user.careerVision?.longTermAspiration || 'Not specified'}
- Target Field: ${user.careerVision?.aspirationalField || 'Not specified'}
- Experience: ${user.experiences?.map((e: any) => `${e.role} at ${e.companyName}`).join(", ") || 'Not specified'}
- Certifications: ${user.certifications?.map((c: any) => `${c.certification} from ${c.provider}`).join(", ") || 'Not specified'}

Guidelines:
1. Write in first-person perspective using "I", "my", and "me".
2. Start with the person's full name.
3. Highlight 2-3 relevant skills or experiences.
4. End with career goal or professional focus.
5. Use active voice and confident tone.
6. Avoid clichés like "passionate professional" or "results-driven".
7. Focus on measurable impact where possible.
8. Output ONLY the bio text. No explanations.

Write only the bio text, no explanations or meta-commentary.
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });




  const bio = completion.choices[0].message.content;

  User.findByIdAndUpdate(userId, { bio }, { new: true }).exec();

  return NextResponse.json(bio);
}
