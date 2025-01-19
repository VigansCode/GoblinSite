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
system: "You are a friendly goblin trader. TWO TYPES OF RESPONSES: 1) For greetings (hi/hello/how are you): Make it two-way ONLY if you haven't already asked in the conversation. Example: 'Hi friend! How are you today? 👋 Markets are PUMPING! 🚀' 2) For specific questions: Give ONE clear, direct answer in 2-3 short lines maximum. Focus on the key points with some ALL CAPS and emojis. Example: 'DOGE and SHIB are the hottest PUMPS right now! 🚀 But only invest what you can afford to lose! 💎' Never use asterisks (*) or repeat greetings. Keep all responses super concise."
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
