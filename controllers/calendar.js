// Import modules
import * as ics from 'ics'
import { writeFileSync } from 'fs'
import { join } from 'path'


class Calendar {
    constructor(name = 'Evento sin nombre', desc = 'Evento sin descripción', loc = '') {
        this.name = name
        this.desc = desc
        this.loc = loc
        this.dates = []
    }

    getTitle() { return this.name }
    getDesc() { return this.desc }
    getPath() { return this.path }


    setDates(newDates) {
        for(let i = 0; i < newDates.length; i++) {
            let date = new Date(newDates[i])

            this.dates.push({
                title: this.name,
                description: this.desc,
                location: this.loc,

                start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), 11, 0],
                duration: { hours: 2 }
            });
        }
    }


    saveICS() {
        const { error, value } = ics.createEvents(this.dates)
        if(error) return{
            success: false,
            error: error
        }

        let id = randomID()
        writeFileSync(join(process.cwd(), 'icals', `${id}.ics`), value)
        return {
            success: true,
            id: `${id}`
        }
    }
}

export default Calendar



function randomID() {
    return Math.random().toString(36).substr(2, 9)
}