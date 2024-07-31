const mongoose = require("mongoose");
const { type } = require("os");

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
        // index: { unique: false, dropDups: true },
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
    solutions: [{
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        },
        solution: mongoose.Schema.Types.Mixed,
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    idNumber: {
        type: String,
        unique: true,
        required: true,
      },
});

module.exports = mongoose.model("User", userSchema);