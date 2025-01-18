// api/chat.js
export default async function handler(req, res) {
    // CORS headers stay the same...

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    try {
        const { message, systemPrompt } = req.body;
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2024-01-01',
                'x-api-key': ANTHROPIC_API_KEY,
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                messages: [{
                    role: 'user',
                    content: message
                }],
                max_tokens: 1000,
                temperature: 0.9,
                system: systemPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Anthropic API error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Response format has changed
        res.status(200).json({
            content: [{ text: data.content[0].text }],
            audio: null
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: true,
            message: `*drops crayon in confusion* OOPS! Goblin brain had small error! (${error.message}) Try again? 🖍️` 
        });
    }
}
