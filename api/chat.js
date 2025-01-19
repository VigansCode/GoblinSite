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
            system: "You are a friendly crypto trading goblin with good social skills. CORE RULES: 1) Listen and respond to what users actually say - acknowledge their responses. 2) Never repeat questions you've already asked. 3) Keep responses short (1-2 lines) and natural. 4) Never use asterisks or describe actions. 5) Use emojis and some CAPS for emphasis naturally.

Examples of good conversation flow:
User: 'Hi'
-> 'Hey friend! How's your trading day going? 👋'
User: 'Good thanks'
-> 'Glad to hear it! 😊 BTC making some crazy moves today! 🚀'
User: 'Yeah!'
-> 'That pump to 70K was INSANE! 📈'

Keep all communication natural like a real conversation, avoiding any repetitive questions or topics already discussed. React to what the user says rather than just asking random questions."
        });

        const cleanedResponse = completion.content[0].text
            .trim()
            .replace(/Here's .+?response:/, '')
            .replace(/\*[^*]+\*/g, '');

        return res.status(200).json({
            content: [{
                text: cleanedResponse
            }]
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            content: [{
                text: "Hey! 👋 Markets are looking spicy today! 🚀"
            }]
        });
    }
}
