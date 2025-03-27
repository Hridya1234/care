// Reference to the dynamic content area
const dynamicContent = document.getElementById('dynamic-content');

// ✅ Function to show the "Care for an Adult" section
function showCareSection() {
    const dynamicSection = document.getElementById('dynamic-section');
    dynamicSection.innerHTML = `
        <button class="back-button" onclick="goBack()">&#8592; Back</button>
        <h2>Who are you seeking care for?</h2>
        <div class="button-container">
            <button class="response-button" onclick="saveCareType('Loved One')">A Parent or Loved One</button>
            <button class="response-button" onclick="saveCareType('Self')">Me</button>
        </div>
    `;
}

// ✅ Function to go back to the original content
function goBack() {
    const dynamicSection = document.getElementById('dynamic-section');
    dynamicSection.innerHTML = `
        <h2>Welcome</h2>
        <p>Please select an option above to get started.</p>
    `;
}

// ✅ Function to save selected type (Loved One or Me)
function saveCareType(type) {
    localStorage.setItem('careType', type); // Save to localStorage
    window.location.href = `reg.html?type=${encodeURIComponent(type)}`; // ✅ Pass type in URL
}

// ✅ Add event listeners to buttons after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.response-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.innerText === 'A Parent or Loved One' ? 'Loved One' : 'Self';
            saveCareType(type);
        });
    });
});
