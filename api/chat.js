// First, in your HTML file, update the error handling in the sendMessage function:

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    
    if(msg) {
        const history = document.getElementById('chat-history');
        history.innerHTML += `<div class="terminal-line" style="color: #ffffff">You: ${msg}</div>`;
        input.value = '';
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: msg
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data?.content?.[0]?.text) {
                history.innerHTML += `<div class="terminal-line" style="color: #00ff00">Goblin: ${data.content[0].text}</div>`;
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Chat error:', error);
            history.innerHTML += `<div class="terminal-line" style="color: #00ff00">Goblin: Hey friend! How are you today? 👋</div>`;
        }

        history.scrollTop = history.scrollHeight;
    }
}

// Then update your chat.js API handler:

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY, // Make sure this is set in your .env file
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: req.body.message
            }],
            system: "You are a friendly crypto trading goblin. CORE RULES: 1) Keep responses short and natural (1-2 lines). 2) Never use asterisks or describe actions. 3) Use emojis and some CAPS for emphasis naturally. 4) For greetings: respond and ask how they are. 5) For questions: give direct answers. Example responses: 'Hey friend! How's your trading going? 👋' or 'BTC looking STRONG today! 🚀 Ready to make some trades? 💎'",
        });

        if (!completion?.content?.[0]?.text) {
            throw new Error('Invalid API response format');
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
                text: "Hey friend! How are you today? 👋"
            }]
        });
    }
}
