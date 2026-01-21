---
sitemap:
  exclude: 'yes'
---
function handleEvent(e) {
    var wrapper = document.getElementById('event-wrapper');
    removeElements(wrapper);
    var p = document.createElement('p');
        var pT = document.createTextNode('Event kunde inte laddas.');
        p.appendChild(pT);
    wrapper.appendChild(p);
    console.log(`Event kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
    errorPost(`Event kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
};
var loadFile = function (filePath, done) {
    hideElement('eventLoader');
    var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', handleEvent);
        xhr.onload = function () { return done(this.responseText) }
        xhr.open("GET", encodeURI(filePath), true);
        xhr.send();
};
    loadFile("/assets/data/event.json", function (responseText) {
        var res = JSON.parse(responseText);
        console.log('Events: ' + res.latestUpdate);
        var wrapper = document.getElementById('event-wrapper');
        removeElements(wrapper);
            res.data.forEach(row => {
                var link = document.createElement('a');
                    link.setAttribute('href', row[3]);
                    link.setAttribute('class', 'cal-ev');
                    link.setAttribute('title', row[2]);
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener');
                    var linkDate = document.createElement('div');
                        linkDate.setAttribute('class', 'cal-ev-col');
                        var linkDateDay = document.createElement('div');
                            linkDateDay.setAttribute('class', 'oneline');
                            var linkDateDayText = document.createTextNode(parseInt(row[0].split('-')[2]));
                            linkDateDay.appendChild(linkDateDayText);
                        linkDate.appendChild(linkDateDay);
                        var linkDateMonth = document.createElement('div');
                            linkDateMonth.setAttribute('class', 'min');
                            var linkDateMonthText = document.createTextNode(monthText(row[0].split('-')[1]));
                            linkDateMonth.appendChild(linkDateMonthText);
                        linkDate.appendChild(linkDateMonth);
                    link.appendChild(linkDate);
                    var linkTitle = document.createElement('div');
                        linkTitle.setAttribute('class', 'cal-ev-col min');
                        var linkTitleText = document.createTextNode(row[2]);
                        linkTitle.appendChild(linkTitleText);
                    link.appendChild(linkTitle);
                wrapper.appendChild(link);
            });
    });
