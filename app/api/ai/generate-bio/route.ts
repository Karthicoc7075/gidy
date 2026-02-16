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
- Name: ${user.name || 'Professional'}
- Current Role/Title: ${user.descriptionType || 'Professional'}
- Core Skills: ${user.skills?.map(skill => skill.name).join(", ") || 'Not specified'}
- Career Aspiration: ${user.careerVision?.longTermAspiration || 'Not specified'}
- Target Field: ${user.careerVision?.aspirationalField || 'Not specified'}
- Experience: ${user.experiences?.map(e => `${e.role} at ${e.companyName}`).join(", ") || 'Not specified'}
- Certifications: ${user.certifications?.map(c => `${c.certification} from ${c.provider}`).join(", ") || 'Not specified'}

Guidelines:
1. Start with the person's name and current role (e.g., "Sarah Chen is a software engineer specializing in...")
2. Highlight 2-3 most relevant skills, experiences, or achievements
3. End with career goal or passion (if provided)
4. Use third-person perspective for professional bios
5. Use active voice and confident tone
6. Avoid clichés like "passionate professional" or "results-driven"
7. Make it sound human and authentic, not robotic
8. Focus on impact and value, not just titles

Write only the bio text, no explanations or meta-commentary.
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });




  const bio = completion.choices[0].message.content;

  User.findByIdAndUpdate(userId, { bio }, { new: true }).exec();

  return NextResponse.json(bio );
}
