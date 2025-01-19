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

        const messages = [{
            role: "system",
            content: "You are a friendly crypto goblin chatting casually. Use green text color. Keep responses very short. Add emojis occasionally. Never use asterisks or action descriptions."
        }];

        // Add the user's message
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

        // Get the response text
        const responseText = completion.content[0].text.trim();
        
        // Return the response directly
        return res.status(200).json({ 
            message: responseText 
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Failed to process message' 
        });
    }
}
