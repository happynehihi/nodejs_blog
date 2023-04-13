import express, { json, urlencoded } from 'express'
const app = express()
const port = 3000

import { user_router } from './routes/user.js'

app.use(json())

app.use(urlencoded({ extended: true }))

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

app.use('/user', user_router);
