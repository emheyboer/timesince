function setIfDiff(obj, key, value) {
    if (obj[key] != value) {
      obj[key] = value;
    }
}

function update() {
    var today = Temporal.Now.plainDateISO();
    var url = new URL(location);

    // if the datepicker's got a value, use that
    if (datepicker.value) {
        url.searchParams.set('date', datepicker.value);
    } else { // otherwise, use the query string/today's date
        if (!url.searchParams.has('date')) {
            url.searchParams.set('date', today.toString());
        }
        datepicker.value = url.searchParams.get('date');
    }
    datepicker.max = today.toString();
    datepicker.disabled = false;

    if (url.href != location.href) {
        history.replaceState('', '', url.href);
    }

    var start = Temporal.PlainDate.from(url.searchParams.get('date'));
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