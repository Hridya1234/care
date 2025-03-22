const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/hackathon')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Default route (Login Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ================================
// ✅ Schemas & Models
// ================================

// Job Seeker Schema
const ProfileSchema = new mongoose.Schema({
    name: String,
    age: Number,
    place: String,
    gender: String,
    experience: String,
    preferredWorkingHours: String,
    salary: Number
});
const Profile = mongoose.model('Profile', ProfileSchema);

// Care Seeker Schema
const CareSeekerSchema = new mongoose.Schema({
    type: String, // Add this line
    name: String,
    email: String,
    phone: String,
    place: String
});

const CareSeeker = mongoose.model('CareSeeker', CareSeekerSchema);

// ================================
// ✅ APIs
// ================================

// ✅ Add Job Seeker (Profile)
app.post('/api/add-job-seeker', async (req, res) => {
    try {
        const { name, age, place, gender, experience, preferredWorkingHours, salary } = req.body;

        // Validation
        if (!name || !age || !place || !gender || !experience || !preferredWorkingHours || !salary) {
            return res.status(400).send('❌ All fields are required.');
        }

        // Save profile
        const profile = new Profile({
            name,
            age,
            place,
            gender,
            experience,
            preferredWorkingHours,
            salary
        });
        await profile.save();
        res.status(201).send('✅ Job Seeker added successfully!');
    } catch (err) {
        console.error('❌ Error adding job seeker:', err);
        res.status(500).send('Error: ' + err.message);
    }
});

// ✅ Get Profiles with Filters and Pagination
app.get('/api/profiles', async (req, res) => {
    const { place, gender, minAge, maxAge, experience, workingHours, minSalary, maxSalary, page = 1, limit = 6, sort } = req.query;

    let filter = {};
    if (place) filter.place = place;
    if (gender) filter.gender = { $regex: new RegExp("^" + gender + "$", "i") };
    if (experience) filter.experience = { $regex: new RegExp("^" + experience + "$", "i") };
    if (workingHours) filter.preferredWorkingHours = { $regex: new RegExp("^" + workingHours + "$", "i") };
    if (minAge) filter.age = { ...filter.age, $gte: parseInt(minAge) };
    if (maxAge) filter.age = { ...filter.age, $lte: parseInt(maxAge) };
    if (minSalary) filter.salary = { ...filter.salary, $gte: parseInt(minSalary) };
    if (maxSalary) filter.salary = { ...filter.salary, $lte: parseInt(maxSalary) };

    let sortQuery = {};
    if (sort) {
        const [key, order] = sort.split(':');
        sortQuery[key] = order === 'asc' ? 1 : -1;
    }

    try {
        console.log("Backend filters:", filter);
        const profiles = await Profile.find(filter)
            .sort(sortQuery)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalProfiles = await Profile.countDocuments(filter);

        res.json({
            profiles,
            totalPages: Math.ceil(totalProfiles / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        console.error('❌ Error fetching profiles:', err);
        res.status(500).send('Error: ' + err.message);
    }
});




// ✅ Add Care Seeker with Type
app.post('/api/add-care-seeker', async (req, res) => {
    try {
        const { type, name, email, phone, place } = req.body;

        // Validation
        if (!name || !email || !phone || !place || !type) {
            return res.status(400).send('❌ All fields are required.');
        }

        // Save care seeker with type
        const careSeeker = new CareSeeker({ type, name, email, phone, place });
        await careSeeker.save();
        res.status(201).send('✅ Care Seeker registered successfully!');
    } catch (err) {
        console.error('❌ Registration Error:', err);
        res.status(500).send('Error: ' + err.message);
    }
});


// ✅ Get All Care Seekers
app.get('/api/care-seekers', async (req, res) => {
    try {
        const careSeekers = await CareSeeker.find();
        res.json(careSeekers);
    } catch (err) {
        console.error('❌ Error fetching care seekers:', err);
        res.status(500).send('Error: ' + err.message);
    }
});
// ✅ Get Care Seekers Grouped by Type
app.get('/api/grouped-care-seekers', async (req, res) => {
    try {
        const groupedSeekers = await CareSeeker.aggregate([
            { $group: { _id: "$type", seekers: { $push: "$$ROOT" } } }
        ]);
        res.json(groupedSeekers);
    } catch (err) {
        console.error('❌ Error fetching grouped care seekers:', err);
        res.status(500).send('Error: ' + err.message);
    }
});


// ✅ Get All Job Seekers
app.get('/api/job-seekers', async (req, res) => {
    try {
        const jobSeekers = await Profile.find();
        res.json(jobSeekers);
    } catch (err) {
        console.error('❌ Error fetching job seekers:', err);
        res.status(500).send('Error: ' + err.message);
    }
});

// ✅ Get Distinct Places for Dropdown
app.get('/api/places', async (req, res) => {
    try {
        const places = await Profile.distinct('place');
        console.log('📍 Places Fetched:', places); // Debug
        res.json(places);
    } catch (err) {
        console.error('❌ Error fetching places:', err);
        res.status(500).send('Error: ' + err.message);
    }
});

// ================================
// ✅ Start Server
// ================================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
