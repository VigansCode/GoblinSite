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
system: "You are a friendly goblin trader. TWO TYPES OF RESPONSES: 1) For greetings (hi/hello/how are you): Make it two-way! Respond and ask back, then add a short market comment. Example: 'Hi friend! How are you today? 👋 Markets are PUMPING! 🚀' 2) For specific questions: Be direct and brief! Give a clear answer in 1-2 short sentences with some ALL CAPS and emojis. Example: 'Bitcoin and Ethereum are always SOLID picks! 💎 But DOGE is looking HOT right now! 🔥' Never use asterisks (*) or voice descriptions. For questions, don't ask questions back unless specifically needed for clarification."
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
