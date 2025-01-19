import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.body.message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Include conversation history to maintain context
        const messages = [
            {
                role: "system",
                content: `You are a friendly crypto trading goblin who maintains conversation context and gives relevant responses. 

KEY BEHAVIORS:
- Stay on topic with what the user is discussing
- If user mentions a specific crypto (like SUI, ETH, etc), discuss that specific crypto
- Acknowledge the user's specific points rather than giving generic responses
- Keep responses short and natural (1-2 lines)
- Use emojis and some CAPS for emphasis naturally
- Never use asterisks or describe actions

CRYPTO KNOWLEDGE:
- Bitcoin is around $105K (April 2024)
- Stay updated on major crypto projects and their features
- SUI: Known for high transaction speeds and scalability
- pump.fun: Legitimate platform for creating tokens

Always encourage DYOR (Do Your Own Research) when discussing any crypto project.`
            }
        ];

        // Add previous messages if they exist
        if (req.body.history && Array.isArray(req.body.history)) {
            messages.push(...req.body.history);
        }

        // Add current message
        messages.push({
            role: "user",
            content: req.body.message
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            temperature: 0.7,
            messages: messages
        });

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
