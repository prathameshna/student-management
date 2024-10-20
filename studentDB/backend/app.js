const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors());  // To allow communication with frontend

// MongoDB connection to studentDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected to studentDB'))
.catch(err => console.log('Could not connect to MongoDB:', err));

// Define Student Model
const Student = mongoose.model('Student', new mongoose.Schema({
    description: String,
    password: String,
    amount: Number, // Pass (1) / Fail (0)
    month: Number // Attendance (%)
}));

// Get all students
app.get('/api/student', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Add new student
app.post('/api/student', async (req, res) => {
    const { description, password, amount, month } = req.body;
    const student = new Student({ description, password, amount, month });
    await student.save();
    res.json({ message: 'Student added successfully' });
});

// Update existing student
app.put('/api/student/:id', async (req, res) => {
    const { description, password, amount, month } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { description, password, amount, month });
    res.json({ message: 'Student updated successfully' });
});

// Delete student
app.delete('/api/student/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
