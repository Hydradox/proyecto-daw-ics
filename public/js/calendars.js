// Elementos
let cals = document.getElementById('cals')


// Petición inicial
fetch('/api/getCalendars')
    .then(res => res.json())
    .then(data => {
        console.log(data)

        data.forEach(cal => {
            let card = document.createElement('div')
            card.classList.add('cal-card')

            let name = document.createElement('h3')
            name.textContent = cal.name
            let desc = document.createElement('p')
            desc.textContent = cal.description

            let btn = document.createElement('a')
            btn.classList.add('btn')
            btn.textContent = 'Descargar'
            btn.href = `/api/download/${cal.fileName}`
            btn.download = cal.fileName


            // Append
            card.appendChild(name)
            card.appendChild(desc)
            card.appendChild(btn)

            cals.appendChild(card)
        })
    })