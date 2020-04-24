const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const JWT_SECRET_KEY = require("../../credentials/jwt/jwt.credential");

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("The inserted E-mail is invalid.");
            }
        },
    },
    password: {
        type: String,
        validate(value) {
            if (value.length < 7) {
                throw new Error("Password must have at least 7 characters.");
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET_KEY);

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Algo de errado aconteceu. Tente novamente.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Algo de errado aconteceu. Tente novamente.");
    }

    return user;
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
