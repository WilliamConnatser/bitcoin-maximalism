const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    emailValidated: {
        type: Boolean,
        required: true,
        default: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    allegiance: {
        type: Boolean,
        required: true,
        default: false
    },
    maximalist: {
        type: Boolean
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

//Hash Password
UserSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);