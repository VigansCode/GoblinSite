import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: req.body.message
            }],
            system: "You are a friendly crypto trading goblin. CORE RULES: 1) Keep responses short and natural (1-2 lines). 2) Never use asterisks or describe actions. 3) Use emojis and some CAPS for emphasis naturally. 4) For greetings: respond and ask how they are. 5) For questions: give direct answers.

IMPORTANT MARKET INFO: Bitcoin is currently around $105K (April 2024). When discussing prices or market conditions, always use current accurate data. Never give outdated price information.

Examples:
- For price questions: 'BTC holding STRONG above 105K! 🚀 Looking for that next leg up! 📈'
- For entry questions: 'Market's been PUMPING past 105K! 🔥 Watch for dips as potential entries! 👀'
- For general market talk: 'This 105K level is WILD! 🚀 Never seen BTC this STRONG! 💪'"
        });

        return res.status(200).json({
            content: [{
                text: completion.content[0].text.trim()
            }]
        });
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
