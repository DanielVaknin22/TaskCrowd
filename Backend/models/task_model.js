const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model("Task", taskSchema);