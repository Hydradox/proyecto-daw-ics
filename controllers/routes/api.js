import { join } from 'path'
import { Router } from 'express'
import Calendar from '../calendar.js'

const router = Router()


router.post('/createCalendar', (req, res) => {
    let calendar = new Calendar(req.body.evName, req.body.evDesc, req.body.evLoc)
    calendar.setDates(req.body.evDates)
    return res.json(calendar.saveICS())
})


router.get('/download/:id', (req, res) => {
    res.sendFile(join(process.cwd(), 'icals', `${req.params.id}.ics`))
})


export default router