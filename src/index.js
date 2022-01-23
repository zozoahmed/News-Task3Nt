const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/mongoose')
app.use(express.json())
const userRouter = require('./routers/user')
const userRouter1 = require('./routers/des_user')
app.use(userRouter)
app.use(userRouter1)
app.listen(port,()=>{console.log('Listening on port 3000')})

