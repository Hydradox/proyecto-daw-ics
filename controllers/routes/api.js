import { join } from 'path'
import { Router } from 'express'
import Calendar from '../calendar.js'
import prisma from '../prisma.js'

const router = Router()


router.post('/createCalendar', (req, res) => {
    let calendar = new Calendar(req.body.evName, req.body.evDesc, req.body.evLoc)
    calendar.setDates(req.body.evDates)

    calendar.saveICS()
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.json({ success: false, error: err })
        })
})


router.get('/getCalendars', (req, res) => {
    prisma.event.findMany({
        select: {
            name: true,
            description: true,
            fileName: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json({ success: false, error: err })
        })
})


router.get('/download/:id', (req, res) => {
    res.sendFile(join(process.cwd(), 'icals', `${req.params.id}.ics`))
})


export default router