import { Router } from 'express'
const user_router = Router()
// import { validateRequest } from '../middleware/validateRequest.js'
import { db } from '../database/connection.js'
import { hashPassword, verifyToken } from '../helpers/hash.js'

export { user_router }

user_router.put('/:id', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        })
    }
    const token = req.headers.authorization.split(' ')[1]

    try {
        var decoded = verifyToken(token)
    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }

    if (decoded.id === parseInt(req.params.id)) {
        const {
            hashedPassword,
            salt,
        } = hashPassword(req.body.password)

        req.body.password = hashedPassword
        req.body.salt = salt

        db.query('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(rows)
            }
        })
    } else {
        res.status(403).json({
            message: 'You are not allowed to update this user'
        })
    }
})

user_router.delete('/:id', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        })
    }
    const token = req.headers.authorization.split(' ')[1]

    try {
        var decoded = verifyToken(token)
    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }

    if (decoded.id === parseInt(req.params.id)) {
        db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(rows)
            }
        })
    } else {
        res.status(403).json({
            message: 'You are not allowed to delete this user'
        })
    }
})
