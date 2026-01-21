---
sitemap:
  exclude: 'yes'
---
function handleEnter(el, e){if(e.keyCode == '13'){el.click();};};
function buildNewsTable(newsData){
    var rubriker = ['Datum', 'Rubrik', 'Utgivare'];
    var wrapper = document.getElementById('newsContent');
        removeElements(wrapper);
        var table = document.createElement('table');
            table.setAttribute('class', 'rwd-table');
            var thead = document.createElement('thead');
                var theadline = document.createElement('tr');
                for (let i = 0; i < rubriker.length; i++) {
                    var theadlinecol = document.createElement('th');
                        var theadlinecolt = document.createTextNode(rubriker[i]);
                        theadlinecol.appendChild(theadlinecolt);
                    theadline.appendChild(theadlinecol);
                };
                thead.appendChild(theadline);
            table.appendChild(thead);
            for (let i = 0; i < newsData.length; i++) {
                var line = document.createElement('tr');
                    line.setAttribute('onclick', 'window.open("' + newsData[i].link + '", "_blank");');
                    line.setAttribute('tabindex', '0');
                    line.setAttribute('onkeypress', 'handleEnter(this, event);');
                    var date = document.createElement('td');
                        var datet = document.createTextNode(minDate(newsData[i].date));
                        date.appendChild(datet);
                    line.appendChild(date);
                    var title = document.createElement('td');
                        var titleT = document.createTextNode(newsData[i].title.replace('&#160;', ' '));
                        title.appendChild(titleT);
                    line.appendChild(title);
                    var utgivare = document.createElement('td');
                        var utgivaret = document.createTextNode(newsData[i].source);
                        utgivare.appendChild(utgivaret);
                    line.appendChild(utgivare);
                table.appendChild(line);
            };
            var footer = document.createElement('tr');
                var footerCol = document.createElement('td');
                    footerCol.setAttribute('class', 'min');
                    footerCol.setAttribute('colspan', '3');
                    var footerColT = document.createTextNode('Tillåtelse att ta del och presentera information har införskaffats. Information tillhör respektive källa.');
                    footerCol.appendChild(footerColT);
                footer.appendChild(footerCol);
            table.appendChild(footer);
        wrapper.appendChild(table);
    hideElement('shownyheter');
};
function handleEvent(e) {
    console.log(`Nyhet kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
    errorPost(`Nyhet kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
};
var loadFile = function (filePath, done) {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', handleEvent);
        xhr.onload = function () { return done(this.responseText) }
        xhr.open("GET", encodeURI(filePath), true);
        xhr.send();
};

loadFile('/assets/data/nyheter.json', function (responseText) {
    var data = JSON.parse(responseText).data;
    console.log('Nyheter ' + data[0].source + ': ' + JSON.parse(responseText).latestUpdate);
    for (let a = 0; a < data.length; a++) { newsData.push(data[a]); };
    buildNewsTable(data.data);
});
