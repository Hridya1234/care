document.getElementById('job-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value) || 0;
    const place = document.getElementById('place').value.trim();
    const gender = document.getElementById('gender').value;
    const experience = document.getElementById('experience').value.trim();
    const workingHours = document.getElementById('working-hours').value;
    const salary = parseInt(document.getElementById('salary').value) || 0;

    // Basic validation
    if (!name || !age || !place || !gender || !experience || !workingHours || !salary) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const profile = {
        name,
        age,
        place,
        gender,
        experience,
        preferredWorkingHours: workingHours,
        salary
    };

    try {
        const response = await fetch('http://localhost:5000/api/add-job-seeker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });

        if (response.ok) {
            alert('Job Seeker Registered Successfully!');
            window.location.href = `profile.html?place=${encodeURIComponent(place)}&gender=${encodeURIComponent(gender)}`;
        } else {
            alert('Registration Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server.');
    }
});
