// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded successfully!');
    
    // Initialize the app with only the Three.js container
    const appElement = document.getElementById('app');
    appElement.innerHTML = '<div id="three-container"></div>';
    
    // Launch Three.js example immediately if available
    if (typeof initThreeJSExample === 'function') {
        initThreeJSExample();
    } else {
        console.error('Three.js example function not found');
    }
}); 