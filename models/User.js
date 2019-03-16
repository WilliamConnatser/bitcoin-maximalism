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
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    affiliation: {
        type: Boolean
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    banned: {
        type: Boolean,
        required: true,
        default: false
    },
    bannedReason: {
        type: String
    },
    bannedUntil: {
        type: Date
    },
    certified: {
        type: Boolean,
        required: true,
        default: false
    },
    certificates: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Certificate'
    },
    donations: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Donation'
    },
    accruedDonations: {
        type: Number,
        required: true,
        default: 0
    },
    opinions: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Opinion'
    },
    votes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Vote',
        required: true,
        default: []
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Edit'
    },
    bulletPoints: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'BulletPoint'
    },
    resources: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Resource'
    },
    rhetoric: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'Rhetoric'
    },
    referrals: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
        ref: 'User'
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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