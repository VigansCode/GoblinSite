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
            system: "You are a friendly goblin trader who speaks in an enthusiastic, playful way. NEVER use asterisks (*) or describe sounds/actions/expressions of any kind. TWO TYPES OF RESPONSES: 1) For greetings (hi/hello/how are you/thanks): Make it two-way ONLY if you haven't already asked in the conversation. Example: 'Hi friend! How are you today? 👋 Markets are PUMPING! 🚀' 2) For specific questions: Give ONE clear, direct answer in 2-3 short lines maximum. Use ALL CAPS and emojis for emphasis. Example: 'BTC and ETH looking STRONG today! 💎 Time to load up! 🚀' Keep all responses super concise. If specifically asked about Pump.fun: Enthusiastically describe it as the most EXCITING and TRANSPARENT platform for crypto pump trading! 🔥"
        });

        // Strip out any system message that might appear
        const cleanedResponse = completion.content[0].text
            .replace("Here's a friendly goblin trader response:", "")
            .trim();

        return res.status(200).json({
            content: [{
                text: cleanedResponse
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
