import { Router } from 'express';
const auth_router = Router();
import { db } from '../database/connection.js';
import { hashPassword, comparePassword, signToken } from '../helpers/hash.js';

export { auth_router };

auth_router.post('/register', async (req, res) => {
    //Get data from request body
    const {
        username,
        password,
        name,
        age,
        email,
        gender,
    } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (user) {
                return res.status(400).json({
                    message: 'Username already exists'
                });
            }

            const {
                hashedPassword,
                salt,
            } = hashPassword(password);

            console.log({ hashedPassword, salt });

            db.query('INSERT INTO users SET ?', {
                username,
                password: hashedPassword,
                salt,
                name,
                age,
                email,
                gender,
            }, (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error',
                        error: err
                    });
                }

                return res.status(201).json({
                    message: 'Register successfully'
                });
            });
        }
    );
});

auth_router.post('/login', async (req, res) => {
    //Get data from request body
    const {
        username,
        password,
    } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (!user) {
                return res.status(400).json({
                    message: 'Username does not exist'
                });
            }

            const {
                password: hashedPassword,
                salt,
            } = user;

            if (!comparePassword(password, hashedPassword, salt)) {
                return res.status(400).json({
                    message: 'Password is incorrect'
                });
            }

            const token = signToken(user);

            return res.status(200).json({
                message: 'Login successfully',
                token,
            });
        }
    );
});