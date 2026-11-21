import { NextResponse } from "next/server";
import { design, parseBrief } from "@/lib/planner";
import type { Brief } from "@/lib/planner";

// POST /api/design
// body: { text, room?, style?, budget?, width?, length? }
// Returns the structured design result the HOME AI page renders.
export async function POST(req: Request) {
  let body: Partial<Brief> & { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const text = (body.text ?? "").toString().slice(0, 1000);
  if (!text.trim() && !body.room) {
    return NextResponse.json({ error: "Tell us a little about the space first." }, { status: 400 });
  }

  const brief = parseBrief(text, {
    room: body.room,
    style: body.style,
    budget: body.budget ? Number(body.budget) : undefined,
    width: body.width ? Number(body.width) : undefined,
    length: body.length ? Number(body.length) : undefined,
  });

  return NextResponse.json({ brief, result: design(brief) });
}
