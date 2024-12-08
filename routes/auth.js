const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(400).json({ message: "Authorization token required." });
    }

    jwt.verify(token, "tcmTM" , (err, user) => {
        if(err) {
            res.status(403).json({ message: "Token required." });
        }
        req.user = user;
        next();
    })
};

module.exports = [ authenticationToken ];