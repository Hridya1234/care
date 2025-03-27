// ✅ Fetch Care Seekers and Split by Type
async function fetchCareSeekers() {
    try {
        const response = await fetch('http://localhost:5000/api/care-seekers');
        if (!response.ok) throw new Error('❌ Error fetching care seekers');
        const data = await response.json();

        const lovedOnes = data.filter(seeker => seeker.type === 'Loved One');
        const selfSeekers = data.filter(seeker => seeker.type === 'Self');

        populateCareSeekersTable(lovedOnes, 'loved-one-table');
        populateCareSeekersTable(selfSeekers, 'self-table');
    } catch (error) {
        console.error('❌ Error fetching care seekers:', error);
    }
}

// ✅ Populate Care Seekers Table
function populateCareSeekersTable(data, tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    data.forEach((seeker) => {
        const row = `
            <tr>
                <td>${seeker.name}</td>
                <td>${seeker.type}</td>
                <td>${seeker.email}</td>
                <td>${seeker.phone}</td>
                <td>${seeker.place}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ✅ Fetch Job Seekers
async function fetchJobSeekers() {
    try {
        const response = await fetch('http://localhost:5000/api/job-seekers');
        if (!response.ok) throw new Error('❌ Error fetching job seekers');
        const jobSeekers = await response.json();

        const jobSeekersBody = document.getElementById('job-seekers-body');
        jobSeekersBody.innerHTML = '';
        jobSeekers.forEach(seeker => {
            const row = `
                <tr>
                    <td>${seeker.name}</td>
                    <td>${seeker.age}</td>
                    <td>${seeker.place}</td>
                    <td>${seeker.gender}</td>
                    <td>${seeker.experience}</td>
                    <td>${seeker.preferredWorkingHours || 'N/A'}</td>
                    <td>₹${seeker.salary}</td>
                </tr>
            `;
            jobSeekersBody.innerHTML += row;
        });
    } catch (error) {
        console.error('❌ Error fetching job seekers:', error);
        document.getElementById('job-seekers-body').innerHTML = '<tr><td colspan="7">❌ Error loading data</td></tr>';
    }
}

// ✅ Fetch Bookings
async function fetchBookings() {
    try {
        const response = await fetch('http://localhost:5000/api/bookings');
        if (!response.ok) {
            throw new Error('❌ Error fetching bookings');
        }
        const bookings = await response.json(); // Parse JSON data

        const bookingsBody = document.getElementById('bookings-body');
        bookingsBody.innerHTML = ''; // Clear existing data

        bookings.forEach(booking => {
            const row = `
                <tr>
                    <td>${booking.careSeekerId?.name || 'N/A'}</td>
                    <td>${booking.jobSeekerId?.name || 'N/A'}</td>
                    <td>${booking.jobSeekerId?.place || 'N/A'}</td>
                    <td>${new Date(booking.bookingDate).toLocaleString()}</td>
                </tr>
            `;
            bookingsBody.innerHTML += row;
        });
    } catch (error) {
        console.error('❌ Error fetching bookings:', error);
        document.getElementById('bookings-body').innerHTML = '<tr><td colspan="4">❌ Error loading bookings</td></tr>';
    }
}

// ✅ Fetch All Data on Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchCareSeekers(); // Load care seekers (self & loved one)
    fetchJobSeekers(); // Load job seekers
    fetchBookings();   // Load bookings
});
