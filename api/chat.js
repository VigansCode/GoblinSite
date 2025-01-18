// api/chat.js
export default async function handler(req, res) {
    // Handle CORS
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

    try {
        const { message } = req.body;

        // Make request to Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-beta': 'messages-2023-12-15'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
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
            throw new Error('Failed to get response from Claude');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            content: "*drops crayon in confusion* OOPS! Goblin brain had small error! Try again? 🖍️"
        });
    }
}
