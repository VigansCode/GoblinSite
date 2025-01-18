// api/chat.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    try {
        const { message, systemPrompt } = req.body;
        
        console.log('Making request to Anthropic with message:', message);
        console.log('System prompt:', systemPrompt);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2024-01-01',
                'x-api-key': ANTHROPIC_API_KEY,
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                temperature: 0.9,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: message
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Anthropic API error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Anthropic response:', data);

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
