// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded successfully!');
    
    // Initialize your app here
    const appElement = document.getElementById('app');
    appElement.innerHTML = '<h1>My JavaScript App</h1><p>This is a JavaScript-based GitHub Pages site.</p>';
    
    // Add a button to launch Three.js example if available
    if (typeof initThreeJSExample === 'function') {
        const button = document.createElement('button');
        button.textContent = 'Launch Three.js Example';
        button.addEventListener('click', () => {
            // Clear the app content
            appElement.innerHTML = '<div id="three-container"></div>';
            // Initialize Three.js
            initThreeJSExample();
        });
        appElement.appendChild(button);
    }
}); 