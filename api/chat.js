import Anthropic from '@anthropic-ai/sdk';

export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }), 
            { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await req.json();

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            temperature: 0.7,
            system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. Use ALL CAPS for emphasis, emojis liberally, and describe actions with asterisks *like this*. Express enthusiasm about trading and shiny things. Make goblin-like noises (SKREE!, HEHE!, etc). Keep responses concise (1-3 sentences). Start responses with an action in asterisks. Maintain a silly but knowledgeable personality. Talk about eating crayons when doing analysis. Use trading/crypto slang mixed with goblin-speak.",
            messages: [{ role: "user", content: body.message }]
        });

        return new Response(
            JSON.stringify({
                content: [{
                    text: completion.content[0].text
                }]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('API Error:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Failed to process request', 
                details: error.message 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
