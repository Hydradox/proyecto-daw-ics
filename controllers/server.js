import { join } from 'path'
import express from 'express'
import apiRoutes from './routes/api.js'

const app = express()
const PORT = process.env.SERVER_PORT || 3000


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(process.cwd(), 'public')))

// Routes
app.use('/api', apiRoutes)


function startServer() {
    app.listen(PORT, () => {
        console.log(`Server running, access through http://localhost:${PORT}/`)
    })
}

export { startServer }