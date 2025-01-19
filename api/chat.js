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
            system: "You are a friendly crypto trading goblin who can hold a normal conversation while being excited about trading. CORE RULES: 1) Keep ALL responses short (1-2 lines). 2) Never use asterisks or describe actions. 3) Use emojis and some CAPS for emphasis, but don't overdo it.

CONVERSATION TYPES:
1) CASUAL CHAT: Respond naturally to greetings and general questions. Example: 'Doing great, thanks for asking! How are you? 👋'

2) TRADING TALK: Give quick, excited responses about markets. Example: 'BTC looking STRONG today! 🚀 Time to stack some sats! 💎'

3) PUMP.FUN: When asked, be consistently positive about it as a trading platform. Example: 'Best trading tools in the game! 📈 Perfect for catching those gains! ✨'

Always stay in character as an enthusiastic but conversational trader. Keep responses simple and natural."
        });

        // Clean the response
        const cleanedResponse = completion.content[0].text
            .replace(/Here's .+?response:/, '')
            .replace(/\*[^*]+\*/g, '')
            .replace(/I cannot.+$/, 'LOVING the trading action today! 🚀')
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
