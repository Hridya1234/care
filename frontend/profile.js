// ✅ Check if careSeekerId is correctly stored in localStorage
console.log('✅ Checking stored careSeekerId...');
console.log(localStorage.getItem('careSeekerId')); // Debug to check if careSeekerId is stored

// ✅ Book Profile with Care Seeker and Job Seeker ID
async function bookProfile(jobSeekerId) {
    const careSeekerId = localStorage.getItem('careSeekerId'); // Get Care Seeker ID from Local Storage

    if (!careSeekerId) {
        alert('❌ Error: No Care Seeker selected. Please register first!');
        return;
    }

    try {
        console.log('✅ Booking initiated with IDs:', { careSeekerId, jobSeekerId }); // Debugging output

        const response = await fetch('http://localhost:5000/api/book-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                careSeekerId,
                jobSeekerId
            })
        });

        if (response.ok) {
            const result = await response.json(); // ✅ Check response
            console.log('✅ Booking result:', result);
            alert(result.message || '✅ Booking Successful!');
        } else {
            const errorText = await response.text();
            alert(`❌ Booking Failed: ${errorText}`);
        }
    } catch (error) {
        console.error('❌ Error booking profile:', error);
        alert('❌ Error booking profile. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Page Loaded - Fetching profiles');

    const profileContainer = document.querySelector('.profile-container');
    const filterForm = document.getElementById('filter-form');
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    document.body.appendChild(paginationContainer);

    // ✅ Populate Place Dropdown for Filtering
    async function populatePlaceDropdown() {
        try {
            const response = await fetch('http://localhost:5000/api/places');
            if (!response.ok) throw new Error('❌ Error fetching places');
            const places = await response.json();
            const placeDropdown = document.getElementById('place-filter');

            places.forEach(place => {
                const option = document.createElement('option');
                option.value = place;
                option.textContent = place;
                placeDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('❌ Error fetching places:', error);
        }
    }

    populatePlaceDropdown();

    // ✅ Fetch Profiles and Render Data
    async function fetchProfiles(filters = {}, page = 1, sort = '') {
        filters.page = page;
        filters.limit = 6; // Profiles per page
        if (sort) filters.sort = sort;
        const params = new URLSearchParams(filters);
        const url = `http://localhost:5000/api/profiles?${params.toString()}`;

        try {
            console.log('✅ Fetching profiles with filters:', filters);
            const response = await fetch(url);
            if (!response.ok) throw new Error('❌ Error fetching profiles');
            const data = await response.json();

            if (!Array.isArray(data.profiles)) {
                console.error('❌ Invalid data format from API:', data);
                profileContainer.innerHTML = '<p>❌ Failed to load profiles. Please try again later.</p>';
                return;
            }

            const profiles = data.profiles || [];
            const totalPages = data.totalPages || 1;

            profileContainer.innerHTML = '';
            paginationContainer.innerHTML = '';

            if (!profiles.length) {
                profileContainer.innerHTML = '<p>No profiles found.</p>';
                return;
            }

            // ✅ Render Profiles
            profiles.forEach(profile => {
                const card = document.createElement('div');
                card.className = 'profile-card pop';
                card.innerHTML = `
                    <h3>${profile.name}</h3>
                    <p><strong>Age:</strong> ${profile.age}</p>
                    <p><strong>Place:</strong> ${profile.place}</p>
                    <p><strong>Gender:</strong> ${profile.gender}</p>
                    <p><strong>Experience:</strong> ${profile.experience}</p>
                    <p><strong>Preferred Working Hours:</strong> ${profile.preferredWorkingHours || 'N/A'}</p>
                    <p><strong>Expected Salary:</strong> ₹${profile.salary}</p>
                    <button class="book-now-button" onclick="bookProfile('${profile._id}')">Book Now</button>
                `;
                profileContainer.appendChild(card);
            });

            // ✅ Render Pagination Buttons
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.innerText = i;
                button.className = `pagination-btn ${i === page ? 'active' : ''}`;
                button.addEventListener('click', () => fetchProfiles(filters, i, sort));
                paginationContainer.appendChild(button);
            }
        } catch (error) {
            console.error('❌ Error fetching profiles:', error);
            profileContainer.innerHTML = '<p>❌ Failed to load profiles. Please try again later.</p>';
        }
    }

    // ✅ Handle Filters and Fetch Profiles
    filterForm.addEventListener('change', () => {
        const filters = {
            place: document.getElementById('place-filter').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            minAge: document.getElementById('min-age').value,
            maxAge: document.getElementById('max-age').value,
            experience: document.getElementById('experience-filter').value,
            workingHours: document.getElementById('working-hours-filter').value,
            minSalary: document.getElementById('min-salary').value ? parseInt(document.getElementById('min-salary').value) : '',
            maxSalary: document.getElementById('max-salary').value ? parseInt(document.getElementById('max-salary').value) : ''
        };

        const sort = document.getElementById('sort-dropdown').value;
        fetchProfiles(filters, 1, sort);
    });

    // ✅ Handle Sorting Dropdown Change
    document.getElementById('sort-dropdown').addEventListener('change', () => {
        const filters = {
            place: document.getElementById('place-filter').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            minAge: document.getElementById('min-age').value,
            maxAge: document.getElementById('max-age').value,
            experience: document.getElementById('experience-filter').value,
            workingHours: document.getElementById('working-hours-filter').value,
            minSalary: document.getElementById('min-salary').value ? parseInt(document.getElementById('min-salary').value) : '',
            maxSalary: document.getElementById('max-salary').value ? parseInt(document.getElementById('max-salary').value) : ''
        };

        const sort = document.getElementById('sort-dropdown').value;
        fetchProfiles(filters, 1, sort);
    });

    // ✅ Load Initial Profiles on Page Load
    fetchProfiles({});
});
