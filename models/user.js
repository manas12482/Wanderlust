const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

// passport-local-mongoose will add username and password by default in schema.
// so,we don't need to specify them in schema.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);

