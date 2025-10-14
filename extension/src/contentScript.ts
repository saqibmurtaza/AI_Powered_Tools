console.log('🎯 CardContext content script loaded');

let currentOverlay: HTMLDivElement | null = null;
let currentButton: HTMLButtonElement | null = null;

function showFloatingButton(x: number, y: number, text: string) {
    removeFloatingElements();

    // Create overlay
    currentOverlay = document.createElement('div');
    currentOverlay.style.position = 'fixed';
    currentOverlay.style.top = '0';
    currentOverlay.style.left = '0';
    currentOverlay.style.width = '100%';
    currentOverlay.style.height = '100%';
    currentOverlay.style.zIndex = '2147483646';
    currentOverlay.style.background = 'transparent';
    
    // Create button
    currentButton = document.createElement('button');
    currentButton.textContent = 'Add to Context';
    currentButton.style.position = 'fixed';
    currentButton.style.left = `${x}px`;
    currentButton.style.top = `${y - 50}px`;
    currentButton.style.zIndex = '2147483647';
    currentButton.style.background = '#4d0682';
    currentButton.style.color = 'white';
    currentButton.style.border = 'none';
    currentButton.style.padding = '10px 16px';
    currentButton.style.borderRadius = '8px';
    currentButton.style.fontSize = '14px';
    currentButton.style.fontFamily = 'Poppins, sans-serif';
    currentButton.style.cursor = 'pointer';
    currentButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    currentButton.style.fontWeight = '600';

    // Click handler - FIXED MESSAGE SENDING
    currentButton.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        
        console.log('🎯 Sending message to background...');
        
        // Send message with callback (not async/await)
        chrome.runtime.sendMessage({
            type: 'CAPTURE_SELECTION',
            data: {
                content: text,
                source: window.location.href,
                title: document.title,
                url: window.location.href
            }
        }, (response) => {
            // This callback runs when background responds
            console.log('📨 Background response:', response);
            
            if (response && response.success) {
                console.log('✅ Context saved successfully!');
                showSuccessFeedback();
            } else {
                console.error('❌ Failed to save context:', response?.error);
            }
            
            removeFloatingElements();
        });
    });

    currentOverlay.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        removeFloatingElements();
    });

    document.body.appendChild(currentOverlay);
    document.body.appendChild(currentButton);
    console.log('✅ Floating button added');
}

function removeFloatingElements() {
    if (currentOverlay) {
        currentOverlay.remove();
        currentOverlay = null;
    }
    if (currentButton) {
        currentButton.remove();
        currentButton = null;
    }
}

function showSuccessFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = '✅ Added to context!';
    feedback.style.position = 'fixed';
    feedback.style.top = '20px';
    feedback.style.right = '20px';
    feedback.style.background = '#10b981';
    feedback.style.color = 'white';
    feedback.style.padding = '8px 16px';
    feedback.style.borderRadius = '6px';
    feedback.style.zIndex = '2147483647';
    feedback.style.fontFamily = 'Poppins, sans-serif';
    feedback.style.fontSize = '14px';
    feedback.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

// Listen for text selection
document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0) {
        showFloatingButton(event.pageX, event.pageY, selection);
    }
});

console.log('🎯 CardContext - Fixed messaging version ready!');