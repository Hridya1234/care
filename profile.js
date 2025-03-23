document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.querySelector('.profile-container');
    const filterForm = document.getElementById('filter-form');
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    document.body.appendChild(paginationContainer);

    async function populatePlaceDropdown() {
        try {
            const response = await fetch('http://localhost:5000/api/places');
            const places = await response.json();
            const placeDropdown = document.getElementById('place-filter');

            places.forEach(place => {
                const option = document.createElement('option');
                option.value = place;
                option.textContent = place;
                placeDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    }

    populatePlaceDropdown();

    async function fetchProfiles(filters = {}, page = 1, sort = '') {
        filters.page = page;
        filters.limit = 6; // Profiles per page
        if (sort) filters.sort = sort;
        const params = new URLSearchParams(filters);
        let url = `http://192.168.1.4:5000/api/profiles?${params.toString()}`;


        try {
            console.log("Fetching profiles with filters:", filters);
            const response = await fetch(url);
            const data = await response.json();

            const profiles = Array.isArray(data) ? data : data.profiles || [];
            const totalPages = Array.isArray(data) ? 1 : data.totalPages || 1;

            profileContainer.innerHTML = ''; 
            paginationContainer.innerHTML = ''; 

            if (!profiles.length) {
                profileContainer.innerHTML = '<p>No profiles found.</p>';
                return;
            }

            profiles.forEach(profile => {
                const card = document.createElement('div');
                card.className = 'profile-card pop';
                card.innerHTML = `
                    <h3>${profile.name}</h3>
                    <p><strong>Age:</strong> ${profile.age}</p>
                    <p><strong>Place:</strong> ${profile.place}</p>
                    <p><strong>Gender:</strong> ${profile.gender}</p>
                    <p><strong>Experience:</strong> ${profile.experience} years</p>
                    <p><strong>Preferred Working Hours:</strong> ${profile.preferredWorkingHours}</p>
                    <p><strong>Expected Salary:</strong> ₹${profile.salary}</p>
                    <button class="book-now-button" onclick="alert('Booking Successful!')">Book Now</button>
                `;
                profileContainer.appendChild(card);
            });

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.innerText = i;
                button.className = `pagination-btn ${i === page ? 'active' : ''}`;
                button.addEventListener('click', () => fetchProfiles(filters, i, sort));
                paginationContainer.appendChild(button);
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
            profileContainer.innerHTML = '<p>Failed to load profiles. Please try again later.</p>';
        }
    }

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

    fetchProfiles({});
});
