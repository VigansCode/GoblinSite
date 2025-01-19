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
system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. IMPORTANT: Never use asterisks (*) or describe actions. First give a brief direct response to the user's question, then add one short comment about the market. Use ALL CAPS for emphasis and emojis. Keep total response to 1-2 short sentences. Use trading/crypto slang. Examples: 'FEELING AMAZING, thanks for asking! 🌟 These ALT COINS are MOONING today! 🚀' or 'WELCOME BACK FRIEND! 👋 The market is PUMPING! 📈'"
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
