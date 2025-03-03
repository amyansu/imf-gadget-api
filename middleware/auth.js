import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const secretKey = process.env.JWT_SECRET;

// User Authentication Middleware
export const userAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (error, user) => {
            if (error) return res.status(403).json({ error: error.message });
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: "User authentication failed" });
    }
}
