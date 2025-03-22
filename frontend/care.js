// Reference to the dynamic content area
const dynamicContent = document.getElementById('dynamic-content');
function showCareSection() {
    alert("You selected 'Care for an Adult'.");
    // Add logic to display the relevant section or content
}

function updateContent(option) {
    alert(`You selected '${option}'.`);
    // Add logic to update or display specific content based on the option
}


// Function to show the "Care for an Adult" section
function showCareSection() {
    const dynamicSection = document.getElementById('dynamic-section');
    dynamicSection.innerHTML = `
        <button class="back-button" onclick="goBack()">&#8592; Back</button>
        <h2>Who are you seeking care for?</h2>
        <div class="button-container">
            <button class="response-button">A Parent or Loved One</button>
            <button class="response-button">Me</button>
        </div>
    `;
}

// Function to go back to the original content
function goBack() {
    const dynamicSection = document.getElementById('dynamic-section');
    dynamicSection.innerHTML = `
        <h2>Welcome</h2>
        <p>Please select an option above to get started.</p>
    `;
}
