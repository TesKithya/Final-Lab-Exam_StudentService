
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

// Update student mobile number
app.put('/students/:student_id/mobile', async (req, res) => {
    try {
        const { student_id } = req.params;
        const { student_mobile } = req.body;

        if (!student_mobile) {
            return res.status(400).json({
                message: 'Student mobile number is required'
            });
        }

        const student = await Student.findOneAndUpdate(
            { student_id },
            { $set: { student_mobile } },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json({
            message: 'Student mobile number updated successfully',
            student: {
                student_id: student.student_id,
                student_name: student.student_name,
                student_mobile: student.student_mobile,
                student_email: student.student_email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update mobile number',
            error: error.message
        });
    }
});

// Update student password
app.put('/students/:student_id/password', async (req, res) => {
    try {
        const { student_id } = req.params;
        const { student_password } = req.body;

        if (!student_password) {
            return res.status(400).json({
                message: 'New password is required'
            });
        }

        const hashedPassword = await bcrypt.hash(student_password, 10);

        const student = await Student.findOneAndUpdate(
            { student_id },
            { $set: { student_password: hashedPassword } },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json({
            message: 'Student password updated successfully',
            student_id: student.student_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update password',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Update Student Service running on port ${PORT}`);
});
