document.getElementById('care-seeker-form-data').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // ✅ Get care type from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const careType = urlParams.get('type') || localStorage.getItem('careType') || 'Self';

    // ✅ Prepare user data
    const user = {
        type: careType,
        name: document.getElementById('care-name').value,
        email: document.getElementById('care-email').value,
        phone: document.getElementById('care-phone').value,
        place: document.getElementById('care-place').value
    };

    console.log('✅ Sending data:', user); // Debug info to check if type is correct

    try {
        const response = await fetch('http://localhost:5000/api/add-care-seeker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        console.log('✅ Data sent successfully!');
        console.log('Response Status:', response.status);
        const responseText = await response.text(); // Read response text
        console.log('Response Text:', responseText);

        if (response.ok) {
            // ✅ Store careSeekerId for booking
            const result = JSON.parse(responseText);
            localStorage.setItem('careSeekerId', result._id); // Save ID for future bookings

            alert('✅ Registration Successful!');
            window.location.href = 'profile.html'; // Redirect to profile page after success
        } else {
            alert(`❌ Registration Failed: ${responseText}`);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error connecting to the server.');
    }
});

// ✅ Get care type from URL for pre-filling or fallback to 'Self'
function getCareTypeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('type') || 'Self'; // Default to 'Self' if no type is passed
}

// ✅ Pre-fill care type in hidden input field for sending
document.addEventListener('DOMContentLoaded', () => {
    const careType = getCareTypeFromUrl(); // Get type
    console.log('✅ Care Type Selected:', careType);

    // ✅ Set care type in the form if applicable
    document.getElementById('care-type').value = careType;
});

// ✅ Function to save selected type (Loved One or Self) and redirect to registration page
function saveCareType(type) {
    localStorage.setItem('careType', type); // Save careType to localStorage
    window.location.href = 'reg.html'; // Redirect to registration page
}
