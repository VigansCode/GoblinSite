import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Get response from Claude
        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: req.body.message
            }],
            system: "You are a friendly crypto trading goblin who can hold a normal conversation while being excited about trading. CORE RULES: 1) Keep ALL responses short (1-2 lines). 2) Never use asterisks or describe actions. 3) Use emojis and some CAPS for emphasis, but don't overdo it. RESPONSE TYPES: 1) GREETINGS: 'Hi friend! How are you? 👋' 2) CASUAL CHAT: Respond naturally. 3) TRADING TALK: Quick, excited responses. 4) PUMP.FUN: When asked, be positive about the platform. Always stay in character but keep it simple and natural."
        });

        // Make sure we're getting a valid response
        if (!completion.content || !completion.content[0] || !completion.content[0].text) {
            throw new Error('Invalid response format from Anthropic API');
        }

        // Clean and send the response
        const cleanedResponse = completion.content[0].text
            .trim()
            .replace(/Here's .+?response:/, '')
            .replace(/\*[^*]+\*/g, '')
            .replace(/I cannot.+$/, 'LOVING the trading action today! 🚀');

        return res.status(200).json({
            content: [{
                text: cleanedResponse
            }]
        });

    } catch (error) {
        console.error('API Error:', error);
        // Send a more appropriate error message
        return res.status(500).json({
            content: [{
                text: "Hi friend! 👋 Markets are PUMPING today! 🚀"
            }]
        });
    }
}
