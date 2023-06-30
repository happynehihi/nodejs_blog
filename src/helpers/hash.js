import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export { hashPassword, comparePassword, signToken, verifyToken };

function hashPassword(plainPassword) {
    // Generate random salt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1').toString('hex');

    return {
        salt,
        hashedPassword
    };
}

function comparePassword(plainPassword, hashedPassword, salt) {
    const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1').toString('hex');

    return hash === hashedPassword;
}

function signToken(user) {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        name: user.name,
        age: user.age,
        email: user.email,
        gender: user.gender,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

function verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}