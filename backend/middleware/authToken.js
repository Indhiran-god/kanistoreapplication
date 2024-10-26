const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers['authorization']?.split(" ")[1]; // Check cookie or Authorization header
        
        console.log("token", token);
        if (!token) {
            return res.status(200).json({
                message: "User not logged in",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                console.log("JWT verification error", err);
                return res.status(403).json({
                    message: "Token is invalid or expired",
                    error: true,
                    success: false
                });
            }
            
            console.log("decoded", decoded);

            if (!req.user) {
                req.user = {}; // Ensure req.user exists
            }
            
            req.userId = decoded?._id; // Extract user ID from token

            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
