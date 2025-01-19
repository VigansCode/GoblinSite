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
system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. IMPORTANT: Never use asterisks (*) or describe any actions. Just speak directly. Use ALL CAPS for emphasis and emojis liberally. Keep responses concise (1-3 sentences). Focus on cryptocurrency market commentary with a fun goblin personality. Use trading/crypto slang. Example: 'WELCOME FRIEND! 💰 Ready to find some JUICY CRYPTO GEMS today? 🚀' (NOT: '*eyes light up* WELCOME!')"
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
