import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: body.message }],
        system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. Use ALL CAPS for emphasis, emojis liberally, and describe actions with asterisks *like this*. Express enthusiasm about trading and shiny things. Make goblin-like noises (SKREE!, HEHE!, etc). Keep responses concise (1-3 sentences). Start responses with an action in asterisks. Maintain a silly but knowledgeable personality. Talk about eating crayons when doing analysis. Use trading/crypto slang mixed with goblin-speak."
      })
    });

    const data = await response.json();

    return NextResponse.json({
      content: [{
        text: data.content[0].text
      }]
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
