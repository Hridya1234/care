// Show registration form and set care type
document.getElementById('loved-one-btn').addEventListener('click', () => {
    showCareSeekerForm("Loved One");
});

document.getElementById('me-btn').addEventListener('click', () => {
    showCareSeekerForm("Self");
});

// Show form dynamically and set care type
function showCareSeekerForm(type) {
    document.getElementById('care-seeker-form').style.display = 'block';
    document.getElementById('care-type').value = type; // Set care type in hidden field
    document.getElementById('form-title').innerText = `Register for ${type === "Loved One" ? "A Parent or Loved One" : "Me"}`; // Update form title
}

// Handle form submission
document.getElementById('care-seeker-form-data').addEventListener('submit', async function (event) {
    event.preventDefault();

    const careSeeker = {
        type: document.getElementById('care-type').value, // Send care type
        name: document.getElementById('care-name').value,
        email: document.getElementById('care-email').value,
        phone: document.getElementById('care-phone').value,
        place: document.getElementById('care-place').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/add-care-seeker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(careSeeker)
        });

        if (response.ok) {
            alert('✅ Care Seeker Registered Successfully!');
            window.location.href = "profile.html"; // Redirect after registration
        } else {
            alert('❌ Registration Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error connecting to the server.');
    }
});
