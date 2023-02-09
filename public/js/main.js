// UI Elements
let daySelector = $('#day-list li');
let main = $('main');

// Init vars
let unselectableDates = [];
let userDates = [];

let ts = moment();
const monthCount = 30;

let daysBetweenEvents = $('#daysBetweenEvents');
let evStart = $('#evStart');
let evEnd = $('#evEnd');
let userDaysAffect = $('#userDaysAffect');
let submitBtn = $('#submit');

let calStart = ts.clone().startOf('month');
let calEnd = ts.clone().add(monthCount - 1, 'M').endOf('month');




// Set default params
daysBetweenEvents.val(3);
evStart.val(moment().format('YYYY-MM-DD'));
evEnd.val(moment().add(1, 'Y').format('YYYY-MM-DD'));





/**
 * GENERAR
 * CALENDARIO
 */
/* Generar calendario */
drawCalendar();
function drawCalendar() {
    main.html('');

    for(let i = 0; i < monthCount; i++) {
        main.append(getMonth(ts));
    }
}

/* Constructores de UI */
// Contruir mes
function getMonth(date) {
    date.startOf('month');

    // Init vars
    let dayOfWeek = getNumInWeek(date);
    let weeks = weeksOfMonth(date);
    let startMonth = date.format('MM');

    let month = $('<table class="month"></table>');
    let body = $('<tbody></tbody>');

    let tr;
    let td;


    // Append month name and thead
    month.append(`<caption>${ translateMonth(date.format('MMM')) }</caption>`)
    month.append(`<thead><tr><th>L</th><th>M</th><th>X</th><th>J</th><th>V</th><th>S</th><th>D</th></tr></thead>`);


    // Semanas - Filas de tabla
    for(let i = 0; i < weeks; i++) {
        tr = $('<tr></tr>');

        if(i == 0) {
            date.subtract(dayOfWeek - 1, 'd');
        }

        // Días - Celdas de tabla
        for(let j = 0; j < 7; j++) {
            if(startMonth != date.format('MM')) {
                td = $('<td><div></div></td>');
            } else {
                td = $('<td><div data-date="' + date.format('YYYY-MM-DD') + '" data-day="' + (j + 1) + '">' + date.format('D') + '</div></td>');
            }

            date.add(1, 'd');
            tr.append(td);
        }
        body.append(tr);
    }
    month.append(body)

    return month;
}








/**
 * MARCAR
 * FECHAS
 */
markDates();
function markDates() {
    // Reset marks
    $('.month tbody tr td div').removeClass();

    // Set today mark
    $('.month tbody tr td div[data-date="' + moment().format('YYYY-MM-DD') + '"]').addClass('today');

    // Set outside range marks
    // Before event
    for(let i = calStart.clone(); i < moment(evStart.val()); i.add(1, 'd')) {
        $('.month tbody tr td div[data-date="' + i.format('YYYY-MM-DD') + '"]').addClass('out-of-range');
    }

    // After event
    for(let i = moment(evEnd.val()); i < calEnd; i.add(1, 'd')) {
        $('.month tbody tr td div[data-date="' + i.format('YYYY-MM-DD') + '"]').addClass('out-of-range');
    }



    // Set day selector marks counting days between events
    let daysCount = (daysBetweenEvents.val() || 1) - 1;
    for(let i = moment(evStart.val()).clone(); i < moment(evEnd.val()).clone(); i.add(1, 'd')) {
        // Valid date
        if(userDaysAffect.prop('checked') && userDates.includes(i.format('YYYY-MM-DD'))) {
            daysCount = 0;

        } else {
            if(validDaySelector(i) != 0 && !unselectableDates.includes(i.format('YYYY-MM-DD'))) {
            daysCount++;

            // Reached limit date
            if(daysCount == (daysBetweenEvents.val() || 1)) {
                daysCount = 0;
                $('.month tbody tr td div[data-date="'+ i.format('YYYY-MM-DD')
                + '"][data-day="' + validDaySelector(i) + '"]:not(.out-of-range)').addClass('selected');
            }
            }
        }
    }


    // Set user marks
    for(let i = 0; i < userDates.length; i++) {
        $('.month tbody tr td div[data-date="' + userDates[i] + '"]').addClass('user-selected')
    }


    // Set unselectable marks
    for(let i = 0; i < unselectableDates.length; i++) {
        $('.month tbody tr td div[data-date="' + unselectableDates[i] + '"]:not(.out-of-range)').addClass('unselectable')
    }
}












/**
 * EVENT
 * LISTENERS
 */
/* Day selector listener */
daySelector.on('click', function(e) {
    $(e.target).toggleClass('selected');
    markDates();
});


/* Shifting listener */
let shifting = false;
$(document).on('keyup keydown', function(e){shifting = e.shiftKey} );

/* Unselectable day activator */
$('.month tbody tr td div').on('tap', function(e) { calCellTouch(e, false) });

/* Detect long press */
$('.month tbody tr td div').on('press', function(e) { calCellTouch(e, true); })


function calCellTouch(e, press = false) {
    if(shifting || press) {
        $(e.target).removeClass('user-selected');
        $(e.target).removeClass('selected');
        
        let index = unselectableDates.indexOf($(e.target).data('date'));
        if(index == -1) {
            unselectableDates.push($(e.target).data('date'));
        } else {
            unselectableDates.splice(index, 1);
        }

    } else {
        if(!$(e.target).hasClass('unselectable')) {
            $(e.target).toggleClass('user-selected');

            let index = userDates.indexOf($(e.target).data('date'));
            if(index == -1) {
                userDates.push($(e.target).data('date'));
            } else {
                userDates.splice(index, 1);
            }
        }
    }

    markDates();
}



/* Cal params listener */
$('#daysBetweenEvents, #evStart, #evEnd, #userDaysAffect').on('change input', function(e) {
    markDates();
});







/* Submit data */
submitBtn.on('click', function() {
    let dates = [];
    $('#evName').removeClass('error');
    $('#evDesc').removeClass('error');


    // Check validity
    if($('#evName').val().trim() == '') return $('#evName').addClass('error');
    if($('#evDesc').val().trim() == '') return $('#evDesc').addClass('error');


    // Create dates array
    let sel = $('div.selected');

    for(let i = 0; i < sel.length; i++) { dates.push($(sel[i]).data('date')); }
    for(let i = 0; i < userDates.length; i++) {
        if(!dates.includes(userDates[i])) {
            dates.push(userDates[i]);
        }
    }


    // Send request
    fetch('/api/createCalendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            evName: $('#evName').val().trim(),
            evDesc: $('#evDesc').val().trim(),
            evLoc: $('#evLoc').val().trim(),
            evDates: dates
        })
    })
    .then(res => res.json())
    .then(data => {
        if(!data.success) return alert(data.error);
        downloadFile(data.id);
    })
});



function downloadFile(id) {
    if(!id) return

    let a = document.createElement('a')
    a.href = `/api/download/${id}`
    a.download = id
    a.click()
}









function simplifyName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}


function validDaySelector(date) {
    let day = getNumInWeek(date);
    return ($('#day-list li[data-day="' + day + '"].selected').length == 1 ? day : 0);
}





function getNumInWeek(date) {
    switch(date.clone().format('ddd')) {
        case 'Mon': return 1;
        case 'Tue': return 2;
        case 'Wed': return 3;
        case 'Thu': return 4;
        case 'Fri': return 5;
        case 'Sat': return 6;
        case 'Sun': return 7;
        default: return 0;
    }
}


function weeksOfMonth(date) {
    let weeks = 1;
    let day = getNumInWeek(date.clone().startOf('month'));
    let days = parseInt(date.clone().endOf('month').format('D'));


    for(let i = 0; i < days; i++) {

        if(day == 7) {
            day = 1;
        } else {
            if(day == 1 && i != 0) {
                weeks++;
            }
            day++;
        }
    }

    return weeks;
}


function translateMonth(month) {
    switch(month) {
        case 'Jan': return 'Enero';
        case 'Feb': return 'Febrero';
        case 'Mar': return 'Marzo';
        case 'Apr': return 'Abril';
        case 'May': return 'Mayo';
        case 'Jun': return 'Junio';
        case 'Jul': return 'Julio';
        case 'Aug': return 'Agosto';
        case 'Sep': return 'Septiembre';
        case 'Oct': return 'Octubre';
        case 'Nov': return 'Noviembre';
        case 'Dec': return 'Diciembre';
    }
}