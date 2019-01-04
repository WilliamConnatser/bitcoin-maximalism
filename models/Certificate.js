//Import Mongoose Dependency
const mongoose = require('mongoose');

//Import Bcrypt Dependency For Password
const bcrypt = require("bcrypt");

//Define Model Schema
const CertificateSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        trim: true
    },
    publicKey: {
        type: String,
        required: true,
        trim: true
    },
    privateKey: {
        type: String,
        required: true,
        trim: true
    },
    donations: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Donation'
    },
    pro: {
        type: Boolean,
        required: true
    },
    applicableDonation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Donation'
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Edit'
    },
    dateLastEdited: {
        type: Date,
        required: true,
        default: Date.now
    }
});

//Hash certificate privateKey, so it can't be seen with access to database
CertificateSchema.pre("save", function(next) {
    if (!this.isModified("privateKey") && !this.isModified("password")) {
      return next();
    }

    if(this.isModified("privateKey")) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
        
            bcrypt.hash(this.privateKey, salt, (err, hash) => {
              if (err) return next(err);
        
              this.privateKey = hash;
            });
          });
    }

    if(this.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
        
            bcrypt.hash(this.password, salt, (err, hash) => {
              if (err) return next(err);
        
              this.password = hash;
            });
          });
    }

    return next();
  });

module.exports = mongoose.model('Certificate', CertificateSchema);