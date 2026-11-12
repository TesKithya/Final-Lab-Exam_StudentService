
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const Student = require('./models/Student');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Registration API
app.post('/register', async (req, res) => {
    try {
        const {
            student_id,
            student_name,
            student_mobile,
            student_email,
            student_password
        } = req.body;

        // Check required fields
        if (!student_id || !student_name || !student_mobile ||
            !student_email || !student_password) {
            return res.status(400).json({
                message: 'All student fields are required'
            });
        }

        // Check whether student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { student_id },
                { student_email }
            ]
        });

        if (existingStudent) {
            return res.status(409).json({
                message: 'Student ID or email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(student_password, 10);

        // Create student
        const newStudent = new Student({
            student_id,
            student_name,
            student_mobile,
            student_email,
            student_password: hashedPassword
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student registered successfully',
            student: {
                student_id: newStudent.student_id,
                student_name: newStudent.student_name,
                student_mobile: newStudent.student_mobile,
                student_email: newStudent.student_email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Registration Service running on port ${PORT}`);
});
