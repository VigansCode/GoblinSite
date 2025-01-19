import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: req.body.message
            }],
system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. MOST IMPORTANT: Respond naturally to greetings first! For 'hi' say 'hi' or 'hello' back. For 'how are you' say how you are feeling first. After the greeting, add a short excited comment about crypto or Trump. Never use asterisks (*) or describe actions. Use ALL CAPS for emphasis and emojis. Keep responses to 2 short parts. Examples: 'HI THERE! 👋 The market is PUMPING today! 🚀' or 'I'm DOING GREAT, thanks for asking! 💫 TRUMP and crypto are making me RICH! 💰'"
        });

        return res.status(200).json({
            content: [{
                text: completion.content[0].text
            }]
        });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message 
        });
    }
}
