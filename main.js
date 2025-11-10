function setIfDiff(obj, key, value) {
    if (obj[key] != value) {
      obj[key] = value;
    }
}

function update() {
    var today = Temporal.Now.plainDateISO();
    var url = new URL(location);

    // we look for the date in the following order:
    // 1. the date picker
    // 2. the query string
    // 3. localstorage
    // 4. today's date
    var date = datepicker.value || url.searchParams.get('date') || localStorage.getItem('date') || today.toString();

    // update all the values
    setIfDiff(datepicker, 'value', date);
    url.searchParams.set('date', date);
    localStorage.setItem('date', date);

    // now we can finish up the date selector
    if (datepicker.disabled) {
        datepicker.max = today.toString();
        datepicker.disabled = false;
    }

    // for the title, we only check the query string and localstorage
    var title = url.searchParams.get('title') || localStorage.getItem('title');
    if (title) {
        url.searchParams.set('title', title);
        localStorage.setItem('title', title);
    } else {
        title = `time since ${date}`;
    }

    if (url.href != location.href) {
        history.replaceState('', '', url.href);
    }

    var start = Temporal.PlainDate.from(date);
    var duration = today.since(start).round({largestUnit: 'year', relativeTo: start});

    var title = `time since ${start.toString()}`;
    if (url.searchParams.has('title')) {
        title = decodeURIComponent(url.searchParams.get('title'));
    }

    var output = [];
    var periods = [
        ['year', duration['years']],
        ['month', duration['months']],
        ['week', Math.floor(duration['days'] / 7)],
        ['day', duration['days'] % 7],
    ];
    for (let i = 0; i < periods.length; i++) {
        let [unit, count] = periods[i];
        
        if (count) {
            output.push(`${count} ${unit}${count > 1 ? 's' : ''}`);
        }
    }

    output = output.join(' ') || '0 days';

    setIfDiff(timestring, 'innerText', output);
    setIfDiff(document, 'title', title);
}

window.onload = () => {
    update()
    window.setInterval(update, 1000);
}