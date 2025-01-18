import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, systemPrompt } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const response = {
            content: [{
                text: completion.content[0].text
            }]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
}
