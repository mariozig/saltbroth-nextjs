document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing components...');
    initializeTabs();
    initializeCopyPrompt();
});

/**
 * Initialize tab system for Example Outputs section
 */
function initializeTabs() {
    console.group('Initializing Tabs');
    
    // Get all tab buttons and panels in the Example Outputs section
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    
    console.log('Found tabs:', tabButtons.length);
    console.log('Found panels:', tabPanels.length);
    
    // Exit if no tabs found
    if (!tabButtons.length || !tabPanels.length) {
        console.warn('No tabs or panels found');
        console.groupEnd();
        return;
    }
    
    // Hide all panels initially
    tabPanels.forEach(panel => {
        panel.classList.add('hidden');
        console.log('Initially hiding panel:', panel.id);
    });
    
    // Add click handler to each tab button
    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            console.group('Tab Clicked');
            const targetPanelId = tab.getAttribute('aria-controls');
            console.log('Clicked tab:', tab.textContent.trim(), 'Target panel:', targetPanelId);

            // Reset all tabs to inactive
            tabButtons.forEach(t => {
                console.log('Deactivating tab:', t.textContent.trim());
                t.classList.remove('active', 'bg-white/20', 'text-white', 'border-b-2', 'border-current');
                t.classList.add('bg-white/5', 'text-gray-400');
                t.setAttribute('aria-selected', false);
                const indicator = t.querySelector('.absolute');
                if (indicator) {
                    indicator.style.opacity = '0';
                }
            });

            // Set the clicked tab to active
            tab.classList.add('active', 'bg-white/20', 'text-white', 'border-b-2', 'border-current');
            tab.classList.remove('bg-white/5', 'text-gray-400');
            tab.setAttribute('aria-selected', true);
            console.log('Activated tab:', tab.textContent.trim());

            // Update the indicator color
            const indicator = tab.querySelector('.absolute');
            if (indicator) {
                indicator.style.opacity = '1';
                indicator.style.backgroundColor = tab.dataset.color;
            }

            // Update panel visibility
            tabPanels.forEach(panel => {
                const shouldShow = panel.id === targetPanelId;
                console.log('Panel:', panel.id, 'visible:', shouldShow);
                panel.classList.toggle('hidden', !shouldShow);
            });
            console.groupEnd();
        });
    });
    
    // Set initial active tab
    const initialTab = tabButtons[0];
    if (initialTab) {
        console.log('Setting initial active tab:', initialTab.textContent.trim());
        initialTab.classList.add('active', 'bg-white/20', 'text-white', 'border-b-2', 'border-current');
        initialTab.classList.remove('bg-white/5', 'text-gray-400');
        initialTab.setAttribute('aria-selected', true);
        console.log('Tab state:', initialTab.classList.contains('active'));
        const indicator = initialTab.querySelector('.absolute');
        if (indicator) {
            indicator.style.opacity = '1';
            indicator.style.backgroundColor = initialTab.dataset.color;
        }
        tabPanels.forEach(panel => {
            const shouldShow = panel.id === initialTab.getAttribute('aria-controls');
            panel.classList.toggle('hidden', !shouldShow);
        });
    }
    
    console.groupEnd();
}

/**
 * Initialize copy functionality for the prompt copy button
 */
function initializeCopyPrompt() {
    console.group('Initializing Copy Prompt');
    
    const copyButton = document.querySelector('.glass button');
    const promptText = document.querySelector('.glass pre');
    
    if (!copyButton || !promptText) {
        console.warn('Copy button or prompt text not found');
        console.groupEnd();
        return;
    }
    
    console.log('Copy button and prompt text found');
    
    copyButton.addEventListener('click', async () => {
        console.group('Copy Button Clicked');
        
        try {
            await navigator.clipboard.writeText(promptText.textContent);
            console.log('Text copied to clipboard');
            
            // Store original button state
            const originalHTML = copyButton.innerHTML;
            
            // Update to success state
            copyButton.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            copyButton.classList.add('bg-green-500/10', 'text-green-500');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalHTML;
                copyButton.classList.remove('bg-green-500/10', 'text-green-500');
                console.log('Reset copy button state');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
        
        console.groupEnd();
    });
    
    console.groupEnd();
}
