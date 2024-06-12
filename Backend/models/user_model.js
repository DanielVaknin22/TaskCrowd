const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        index: { unique: false, dropDups: true },
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    tasksSolved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
});

module.exports = mongoose.model("User", userSchema);