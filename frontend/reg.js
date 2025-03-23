document.getElementById('care-seeker-form-data').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get user inputs
    const careType = localStorage.getItem('careType') || 'Self';
    const user = {
        type: careType,
        name: document.getElementById('care-name').value,
        email: document.getElementById('care-email').value,
        phone: document.getElementById('care-phone').value,
        place: document.getElementById('care-place').value
    };

    console.log('✅ Sending data:', user); // Log data before sending

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
            alert('✅ Registration Successful!');
            window.location.href = 'profile.html'; // Redirect to profile page
        } else {
            alert(`❌ Registration Failed: ${responseText}`);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error connecting to the server.');
    }
});
