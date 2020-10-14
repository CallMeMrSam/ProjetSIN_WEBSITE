const { Schema, model } = require('mongoose');

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    permission: {
        default: 0,
        type: Number,
        required: true
    },
    createdAt: {
        default: Date.now,
        type: Number,
        required: true
    }
});

module.exports = model("User", userSchema);