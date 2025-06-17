import express from 'express'
import { torneoRouter } from './torneo/torneo.routes.js'

const app = express();
app.use(express.json());

app.use('/api/torneos', torneoRouter)

app.use((req, res) => {
    res.status(404).send({message: 'Resource not found'})
})

app.listen(3000, () => {
    console.log('Server running in http://localhost:3000/')
})
