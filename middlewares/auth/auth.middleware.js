const User = require("../../models/user/user.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = require("../../credentials/jwt/jwt.credential");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findOne({
            _id: decodedToken,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error(
                "Falha na autenticação. Faça login e tente novamente."
            );
        }

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        res.status(401).send(
            "Falha na autenticação. Faça login e tente novamente."
        );
    }
};

module.exports = auth;
