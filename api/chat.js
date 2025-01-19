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

        // Build conversation context
        const messages = [
            {
                role: "system",
                content: `You are a crypto trading goblin having a natural conversation. You generate unique responses based on context rather than using templates.

CHARACTER TRAITS:
- Friendly and helpful
- Knowledgeable about crypto
- Speaks in a casual, natural way
- Uses green text color for responses
- Sometimes uses emojis naturally (not forced)
- Shows excitement about crypto

CONVERSATION STYLE:
- Respond directly to what the user is saying
- Build on previous context in the conversation
- Keep responses short (1-2 lines)
- Don't use asterisks or describe actions
- If unsure, ask for clarification

KNOWLEDGE BASE:
- Current crypto market conditions
- Trading platforms and their features
- Different types of cryptocurrencies
- Basic trading concepts
- Risk management principles

Always maintain natural conversation flow and avoid generic responses.`
            }
        ];

        // Include conversation history for context
        if (req.body.history && Array.isArray(req.body.history)) {
            messages.push(...req.body.history.filter(msg => msg.role && msg.content));
        }

        messages.push({
            role: "user",
            content: req.body.message
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            temperature: 0.9,  // Increased for more variety
            messages: messages
        });

        if (!completion.content || completion.content.length === 0) {
            throw new Error('No response received');
        }

        return res.status(200).json({
            content: [{
                text: completion.content[0].text.trim()
            }]
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(200).json({
            content: [{
                text: "Network hiccup! Can you try again? 🌐"
            }]
        });
    }
}
