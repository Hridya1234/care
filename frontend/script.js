// Reference to the dynamic content area
const dynamicContent = document.getElementById('dynamic-content');
function showCareSection() {
    fadeOut(dynamicContent, () => {
        dynamicContent.innerHTML = `
            <button class="back-button" onclick="goBack()">&#8592; Back</button>
            <h2>Who are you seeking care for?</h2>
            <div class="button-container">
                <button class="response-button">A Parent or Loved One</button>
                <button class="response-button">Me</button>
            </div>
        `;
        fadeIn(dynamicContent);
    });
}

function updateContent(option) {
    fadeOut(dynamicContent, () => {
        dynamicContent.innerHTML = `<p>You selected '${option}'.</p>`;
        fadeIn(dynamicContent);
    });
}

function goBack() {
    fadeOut(dynamicContent, () => {
        dynamicContent.innerHTML = `
            <h2>Welcome</h2>
            <p>Please select an option above to get started.</p>
        `;
        fadeIn(dynamicContent);
    });
}

// Smooth fade-out effect
function fadeOut(element, callback) {
    element.style.opacity = 1;
    let fadeInterval = setInterval(() => {
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.1;
        } else {
            clearInterval(fadeInterval);
            element.style.display = 'none';
            if (callback) callback();
        }
    }, 30);
}

// Smooth fade-in effect
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let fadeInterval = setInterval(() => {
        if (element.style.opacity < 1) {
            element.style.opacity = parseFloat(element.style.opacity) + 0.1;
        } else {
            clearInterval(fadeInterval);
        }
    }, 30);
}
