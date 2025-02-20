import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Cookie cannot be accessed or modified by the browser
        sameSite : "strict", // Cookie is not sent with cross-origin requests
        secure : process.env.NODE_ENV === 'production' ? true : false

    };

    res.cookie('token', token, options);
}