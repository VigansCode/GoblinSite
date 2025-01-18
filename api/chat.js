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

    try {
        const { message } = req.body;
        
        // Demo responses based on keywords
        const responses = [
            "*jumps excitedly* SKREE! Welcome to goblin trading! How can I help you today? 🦝✨",
            "*munches green crayon thoughtfully* OHOHO! Market looking EXTRA shiny today! 📈🚀",
            "*counts stack of shiny coins* HEHE! Goblin sense BIG PROFIT coming! 💰✨",
            "*scribbles trade analysis with crayon* ME THINK THIS VERY BULLISH! 🖍️📊",
            "*dances around trading terminal* MOON SOON! Goblin feeling EXTRA lucky! 🌙🎰"
        ];

        // Simple logic to pick response based on message content
        let responseIndex = Math.floor(Math.random() * responses.length);
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            responseIndex = 0;
        } else if (message.toLowerCase().includes('market')) {
            responseIndex = 1;
        } else if (message.toLowerCase().includes('profit') || message.toLowerCase().includes('money')) {
            responseIndex = 2;
        } else if (message.toLowerCase().includes('analysis')) {
            responseIndex = 3;
        } else if (message.toLowerCase().includes('moon')) {
            responseIndex = 4;
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        res.status(200).json({
            content: [{
                text: responses[responseIndex]
            }]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: true,
            message: `*drops crayon in confusion* OOPS! Goblin brain had small error! Try again? 🖍️` 
        });
    }
}
