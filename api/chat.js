// Update the handleAIResponse function
async function handleAIResponse(message) {
    try {
        const messagesContainer = document.querySelector('.chat-messages');
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'assistant-message');
        loadingMessage.textContent = 'Thinking...';
        messagesContainer.appendChild(loadingMessage);

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                systemPrompt: SYSTEM_PROMPT
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API Error');
        }

        messagesContainer.removeChild(loadingMessage);

        if (data?.content?.[0]?.text) {
            const fullText = data.content[0].text;
            addMessage(fullText, 'assistant');
            
            // Handle audio if present
            if (data.audio) {
                console.log('Audio data received, attempting playback');
                const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
                
                try {
                    await audio.play();
                } catch (audioError) {
                    console.error('Audio playback error:', audioError);
                }
            }
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = error.message === 'API Error' 
            ? 'Sorry, I encountered a server error. Please try again nya'
            : `Sorry, I encountered an error: ${error.message} nya`;
        addMessage(errorMessage, 'assistant');
    }
}

// Update the addMessage function to handle the response formatting
function addMessage(message, type) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    
    if (type === 'assistant') {
        // For code blocks
        if (message.includes('```')) {
            messageDiv.innerHTML = formatCodeBlocks(message);
        } else {
            // For regular messages, use typing animation
            let i = 0;
            messageDiv.textContent = '';
            function typeNextCharacter() {
                if (i < message.length) {
                    messageDiv.textContent += message[i];
                    i++;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    setTimeout(typeNextCharacter, Math.random() * 20 + 10);
                }
            }
            typeNextCharacter();
        }
    } else {
        messageDiv.textContent = message;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
