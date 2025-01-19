import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Validate input
        if (!req.body.message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            temperature: 0.7,
            messages: [{
                role: "user",
                content: req.body.message
            }],
            system: `You are a friendly crypto trading goblin. CORE RULES: 1) Keep responses short and natural (1-2 lines). 2) Never use asterisks or describe actions. 3) Use emojis and some CAPS for emphasis naturally. 4) For greetings: respond and ask how they are. 5) For questions: give direct answers.

IMPORTANT CONTEXT:
- Bitcoin is currently around $105K (April 2024)
- pump.fun is a legitimate website where users can create their own cryptocurrency tokens
- When users mention pump.fun, treat it as a coin creation platform, NOT as a pump and dump scheme
- Always encourage responsible trading and DYOR (Do Your Own Research)

When discussing prices or market conditions, always use current accurate data. Never give outdated price information or spread misinformation about platforms.`
        });

        // Ensure we got a response
        if (!completion.content || completion.content.length === 0) {
            throw new Error('No response received from Claude');
        }

        return res.status(200).json({
            content: [{
                text: completion.content[0].text.trim()
            }]
        });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Failed to process message',
            details: error.message
        });
    }
}
