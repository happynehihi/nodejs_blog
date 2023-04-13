import { Router } from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { db } from '../database/connection.js'

const user_router = Router()
export { user_router }

user_router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user')
        res.status(200).json(rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

user_router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [req.params.id])
        if (rows.length) {
            res.status(200).json(rows[0])
        } else {
            res.status(404).send('User not found')
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})

user_router.put('/:id', validateRequest, async (req, res) => {
    try {
        await db.query('UPDATE user SET ? WHERE id = ?', [req.body, req.params.id])
        res.status(200).send('User updated')
    } catch (err) {
        res.status(500).send(err.message)
    }
})

user_router.post('/', validateRequest, async (req, res) => {
    try {
        await db.query('INSERT INTO user SET ?', req.body)
        res.status(201).send('User created')
    } catch (err) {
        res.status(500).send(err.message)
    }
})

user_router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM user WHERE id = ?', [req.params.id])
        res.status(200).send('User deleted')
    } catch (err) {
        res.status(500).send(err.message)
    }
})
