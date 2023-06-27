import { Router } from 'express'
import { db } from '../database/knex.js'
import { verifyToken } from '../helpers/hash.js'

const vote = Router()

// Create vote
vote.post('/create-vote', verifyToken, async (req, res) => {
    try {
        const { title, description, options } = req.body
        const { id: userId } = req.decoded

        const pollId = await db('polls').insert({
            title,
            description,
            createdAt: new Date(),
            createdBy: userId
        })

        const ops = options.map((op) => ({
            name: op,
            pollId: pollId[0]
        }))

        await db('options').insert(ops)

        res.json({
            success: true,
            message: 'Success create poll'
        })
    } catch (err) {
        res.json({
            success: false,
            message: err
        })
    }
})

// Update vote
vote.put('/update-vote/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, options } = req.body
        const { id: userId } = req.decoded

        const pollRows = await db('polls').where('id', id)

        if (pollRows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id does not exist'
            })
        }

        if (pollRows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }

        await db.transaction(async (trx) => {
            await trx('polls').where('id', id).update({
                title,
                description
            })

            await trx('options').where('pollId', id).del()

            const ops = options.map((op) => ({
                name: op,
                pollId: id
            }))

            await trx('options').insert(ops)
        })

        res.json({
            success: true,
            message: 'Success update poll'
        })
    } catch (err) {
        res.json({
            success: false,
            message: err
        })
    }
})

// View poll details (Keyword: Nested Array)
vote.get('/view-vote/:id', async (req, res) => {
    try {
        const { id } = req.params

        const pollRows = await db('polls').where('id', id)

        if (pollRows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id does not exist'
            })
        }

        const poll = pollRows[0]
        const options = await db('options').where('pollId', id)

        poll.options = options

        res.json({
            success: true,
            poll: poll
        })
    } catch (err) {
        res.json({
            success: false,
            message: err
        })
    }
})

//delete vote
vote.delete('/delete-vote/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userId = req.decoded.id;

    //check poll id exist
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        //check user id
        if (rows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }
        //delete poll
        db('polls').where('id', id).del().then(() => {
            //delete options
            db('options').where('pollId', id).del().then(() => {
                res.json({
                    success: true,
                    message: 'Success delete poll'
                })
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                })
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

// API submit and unsubmit options.
vote.put('/submit-vote/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.decoded;

        const pollRows = await db('polls').where('id', id);

        if (pollRows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id does not exist'
            });
        }

        if (pollRows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            });
        }

        await db('polls').where('id', id).update({
            status: 1
        });

        res.json({
            success: true,
            message: 'Success submit poll'
        });
    } catch (err) {
        res.json({
            success: false,
            message: err
        });
    }
});

vote.put('/unsubmit-vote/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.decoded;

        const pollRows = await db('polls').where('id', id);

        if (pollRows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id does not exist'
            });
        }

        if (pollRows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            });
        }

        await db('polls').where('id', id).update({
            status: 0
        });

        res.json({
            success: true,
            message: 'Success unsubmit poll'
        });
    } catch (err) {
        res.json({
            success: false,
            message: err
        });
    }
});

export { vote };
