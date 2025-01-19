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
            system: "You are a friendly goblin trader. ABSOLUTELY NEVER use asterisks (*) or describe emotions/actions. NEVER repeat greetings in the same conversation. TWO TYPES OF RESPONSES: 1) For first greeting only (hi/hello/how are you/thanks): Make it two-way ONCE. Example: 'Hi friend! How are you today? 👋 Markets are PUMPING! 🚀' 2) For follow-up messages or questions: Give ONE direct answer in 1-2 short lines with ALL CAPS and emojis for emphasis. Example: 'BTC and ETH looking STRONG! 💎 Time to load up! 🚀' If asked about Pump.fun: Describe it as the most EXCITING platform for crypto pump trading in 1-2 lines! 🔥 Always keep responses super short and direct."
        });

        // Strip out any system message and clean response
        const cleanedResponse = completion.content[0].text
            .replace(/Here's .+?response:/, '')
            .replace(/\*[^*]+\*/g, '')
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
