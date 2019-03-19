//Apollo errors
const {
    ApolloError,
    UserInputError,
} = require('apollo-server');

//Resolver helpers
const {
    sendRegistrationEmail,
    parseError
} = require('../helpers');

module.exports = async (_, {
    username,
    email,
    password,
    ref
}, {
    User
}) => {
    try {
        //Validation

        //Construct regex for case-insensitive Mongoose query
        const usernameRegEx = new RegExp(username.replace('.', '\.'), 'i');
        const userInUse = await User.findOne({
            username: usernameRegEx
        });
        if (userInUse) throw new UserInputError("username-taken");
        if (username.length > 25) throw new UserInputError("username-length");

        //Construct regex for case-insensitive Mongoose query
        const emailRegEx = new RegExp(email.replace('.', '\.'), 'i');
        const emailInUse = await User.findOne({
            email: emailRegEx
        });
        if (emailInUse) throw new UserInputError("email-taken");

        let referredBy = null;
        if (ref) {
            referredBy = await User.findOne({
                _id: ref
            });
            if (!referredBy) throw new UserInputError("invalid-referral");
        }

        //Construct the user object to be inserted
        const userObject = {
            username,
            email,
            password,
            referredBy: ref
        }
        //If this is the first user registering, then make them an Admin
        if (await User.findOne() == undefined) {
            userObject.admin = true;
        }
        //Save new user to the database
        const newUser = await new User(userObject).save();

        //Save the new user's ID in the referrer's referrals array
        if (ref) {
            referredBy.referrals.push(newUser._id);
            referredBy.save();
        }

        //Construct and send email verification
        sendRegistrationEmail(newUser);

        return true;
    } catch (err) {
        throw new ApolloError(parseError(err.message, 'An unknown error occurred while creating your user'));
    }
}