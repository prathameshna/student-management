const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected to studentDB...'))
    .catch(err => console.log(err));

// Define student schema and model
const studentSchema = new mongoose.Schema({
    description: { type: String, required: true },
    password: { type: String, required: true },
    amount: { type: Number, required: true }, // Pass (1) / Fail (0)
    month: { type: Number, required: true } // Attendance (%)
});

const Student = mongoose.model('student', studentSchema); // Collection name is 'student'

// Middleware
app.use(cors());
app.use(express.json());

// Add a new student
app.post('/api/student', async (req, res) => {
    const { description, password, amount, month } = req.body;

    try {
        const newStudent = new Student({ description, password, amount, month });
        await newStudent.save();
        res.status(201).send(newStudent);
    } catch (err) {
        res.status(400).send({ message: 'Error adding student' });
    }
});

// Get all students
app.get('/api/student', async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).send(students);
    } catch (err) {
        res.status(400).send({ message: 'Error fetching students' });
    }
});

// Update a student
app.put('/api/student/:id', async (req, res) => {
    const { description, password, amount, month } = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { description, password, amount, month },
            { new: true }
        );
        res.status(200).send(updatedStudent);
    } catch (err) {
        res.status(400).send({ message: 'Error updating student' });
    }
});

// Delete a student
app.delete('/api/student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(400).send({ message: 'Error deleting student' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
