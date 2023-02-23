// Import modules
import * as ics from 'ics'
import { writeFileSync } from 'fs'
import { join } from 'path'
import prisma from './prisma.js'


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


    async saveICS() {
        return new Promise(async (resolve, reject) => {
            const { error, value } = ics.createEvents(this.dates)
            if(error) resolve({
                success: false,
                error: error
            })


            let filename = `${randomID()}_${simplifyName(this.name)}`
            writeFileSync(join(process.cwd(), 'icals', `${filename}.ics`), value)

            await prisma.event.create({
                data: {
                    name: this.name,
                    description: this.desc,
                    fileName: filename
                }
            })

            resolve({
                success: true,
                id: `${filename}`
            })
        })
    }
}

export default Calendar



function randomID() {
    return Math.random().toString(36).substring(2, 6)
}


function simplifyName(name) {
    return name.toLowerCase().replace(/ /g, '_').replace(/[^a-zA-Z\d]+/g, '')
}