// middleware/auth.js
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token.split(' ')[1], secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = authenticateToken;
