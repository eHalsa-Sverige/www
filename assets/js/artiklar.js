---
sitemap:
  exclude: 'yes'
---
function handleEventArtikel(e) {
    var wrapper = document.getElementById('feedContent');
    removeElement('feedLoader');
    var p = document.createElement('p');
        p.setAttribute('style', 'margin: 0px;');
        var pT = document.createTextNode('Artiklar kunde inte laddas.');
        p.appendChild(pT);
    wrapper.appendChild(p);
    console.log(`Artiklar kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
    errorPost(`Artiklar kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
};
var loadFile = function (filePath, done) {
    hideElement('feedLoader');
    var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', handleEventArtikel);
        xhr.onload = function () { return done(this.responseText) }
        xhr.open("GET", encodeURI(filePath), true);
        xhr.send();
};
var file = '/assets/data/pubmed.json';
loadFile(file, function (responseText) {
    console.log('Artiklar: ' + JSON.parse(responseText).latestUpdate);
    var data = JSON.parse(responseText).data;
    var wrapper = document.getElementById('feedContent');
    for( var i=0,t = data.length ; i < t ; ++i ){
        if(i == 3){ break; };
        var item = data[i];
        var id = item.url.replace('www.', '').replace('http://', '').replace('https://', '').split('.')[0];
        var line = document.createElement('a');
            line.setAttribute('href', item.url);
            line.setAttribute('target', '_blank');
            line.setAttribute('alt', 'Klicka på länken för att komma till artikeln');
            line.setAttribute('rel', 'noopener noreferrer"');
            var date = document.createElement('span');
                var datet = document.createTextNode(minDate(item.date));
                date.appendChild(datet);
            line.appendChild(date);
            var icon = document.createElement('span');
                var iconb = document.createElement('img');
                    iconb.setAttribute('src', '/assets/images/icons/feeds/pubmed.svg');
                    iconb.setAttribute('alt', 'PubMed ikon');
                    iconb.setAttribute('height', '35px');
                    iconb.setAttribute('width', '35px');
                icon.appendChild(iconb);
            line.appendChild(icon);
            var title = document.createElement('span');
                var titlet = document.createTextNode(item.title);
                title.appendChild(titlet);
            line.appendChild(title);
        wrapper.appendChild(line);
    };
    removeElement('feedLoader');
});
