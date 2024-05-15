const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    numsolution: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
    },
    labels: [{
        type: String,
    }],
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        }
    ],
    status: {
        type: String,
        enum: ['Created', 'Solved', 'Reviewed'],
        default: 'Created'
    }
});

module.exports = mongoose.model("Task", taskSchema);