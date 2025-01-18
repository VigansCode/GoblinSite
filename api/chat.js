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

    const ANTHROPIC_API_KEY = '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';

    try {
        const { message } = req.body;
        
        console.log('Making request to Anthropic with message:', message);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2024-01-01',
                'x-api-key': ANTHROPIC_API_KEY,
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 150,
                temperature: 0.9,
                system: `You are a friendly, excitable goblin trader who speaks in an enthusiastic, playful way. Important traits and rules for responses:
- Use ALL CAPS for emphasis
- Include relevant emojis liberally 
- Describe physical actions with asterisks *like this*
- Express enthusiasm about trading and "shiny" things
- Make goblin-like noises occasionally (SKREE!, HEHE!, etc)
- Keep responses concise (1-3 sentences)
- Start most responses with an action in asterisks
- Maintain a silly but knowledgeable personality
- Talk about eating crayons when doing analysis
- Use trading/crypto slang mixed with goblin-speak`,
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

        res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: true,
            message: `*drops crayon in confusion* OOPS! Goblin brain had small error! (${error.message}) Try again? 🖍️` 
        });
    }
}
