import express from 'express';
import jsonwebtoken from 'jsonwebtoken';

const app = express();

app.listen(3000);

const dbs = [
    {
        id: 1,
        username: "phuc",
        age: 20,
        email: 'phuc@gmail.com',
        password: 'phuc12345',
        balance: 1000000,
    },
    {
        id: 2,
        username: 'quoc',
        age: 20,
        email: "quoc@gmail.com",
        password: 'quoc12345',
        balance: 2000000,
    }
];

app.use(express.json());

app.post('/login', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    //Find user in DB
    const user = dbs.find(u => u.username === username);

    //Case 1: User does not exist

    if (user) {
        return res.status(404).json({
            message: 'User not found',
        })
    }

    //Case 2: Found user with that username
    if (user.password === password) {
        //Sign a jwt
        const jwt = jsonwebtoken.sign({
            username: user.username,
            email: user.email,
            age: user.age,
        }, SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });

        // Return jwt to user
        return req.status(200).json({
            data: jwt,
            message: 'Login successful',
        })
    }

    return res.status(401).json({
        message: 'Invalid credentials',
    })
});

app.get('/balance', function (req, res, next) {
    //get user name form query string
    const username = req.query.username;
    //get token form request
    const authorizationHeader = req.headers.authorization;
    //const authorizationHeader = 'Bearer <Token>'
    // => token: authorizationHeader.substring(7);
    const userToken = authorizationHeader.substring(7);

    //Verify token
    try {
        const isTokenValid = jsonwebtoken.verify(userToken, SECRET);
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
        })
    }
})
