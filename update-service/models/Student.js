
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    student_name: {
        type: String,
        required: true
    },
    student_mobile: {
        type: String,
        required: true
    },
    student_email: {
        type: String,
        required: true,
        unique: true
    },
    student_password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Student', studentSchema);
