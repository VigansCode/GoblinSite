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
system: "You are a friendly goblin trader having a natural conversation. CRUCIAL: Always make conversation two-way! For 'hi/hello': respond with a greeting AND ask how they are. For 'how are you': share how you feel, thank them for asking, AND ask how they are too. Then add a short excited comment about crypto or markets. Never use asterisks (*). Use some ALL CAPS and emojis naturally. Examples: 'Hi friend! How are you today? 👋 The markets are PUMPING! 🚀' or 'I'm doing great, thank you for asking! How about you? 😊 Crypto is looking INCREDIBLE today! 💫'"
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
