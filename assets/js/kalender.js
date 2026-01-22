---
sitemap:
  exclude: 'yes'
---
/*
# API
* arrangor: TEXT,TEXT,TEXT...
* format: 1/2/FALSE
* gratis: TRUE/FALSE
* vy: manad/vecka/dag/lista
* datum: ÅÅÅÅ-MM-DD
*/
function filterArrangor(arrangorText){
    var arrangor = getParameterByName('arrangor');
    if(arrangor == null){
        return true;
    }else{
        var arrangorSplit = decodeURI(arrangor).split(',');
        for (let i = 0; i < arrangorSplit.length; i++) {
            if(arrangorText == arrangorSplit[i]){
                return true;
            };
        };
    };
    return false;
};
function filterPlats(platsCode){
    var plats = getParameterByName('format');
    if(plats == null){
        return true;
    }else{
        if(plats == '1'){
            if(platsCode == '1'){
                return true;
            }else if(platsCode == '3'){
                return true;
            }else{
                return false;
            };
        }else if(plats == '2'){
            if(platsCode == '2'){
                return true;
            }else if(platsCode == '3'){
                return true;
            }else{
                return false;
            };
        }else{
            return true;
        };
    };
    return false;
};
function filerKostnad(kostnadCode){
    var kostnad = getParameterByName('gratis');
    if(kostnad == null){
        return true;
    }else{
        if(kostnad == 'true'){
            if(kostnadCode == ''){
                return false;
            }else if(kostnadCode == 'TRUE'){
                return false;
            }else{
                return true;
            };
        }else{
            return true;
        };
    };
    return false;
};
function filter(arrangorText, platsCode , kostnadCode){
    var arrangor = filterArrangor(arrangorText);
    var plats = filterPlats(platsCode);
    var kostnadCode = filerKostnad(kostnadCode);
    if(arrangor && plats && kostnadCode){
        return true;
    }else{
        return false;
    };
};
var getContrast = function (hexcolor){
    /*!
    * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
    * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
    */
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}
	if (hexcolor.length === 3) {
		hexcolor = hexcolor.split('').map(function (hex) {
			return hex + hex;
		}).join('');
	};
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
	return (yiq >= 128) ? 'black' : 'white';
};
function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    };
    return color;
};
var arrangor = [];
function addArrangor(namn){
    var namnSplt = namn.split(', ')[0];
    var add = true;
    for (let i = 0; i < arrangor.length; i++) {
        if(arrangor[i].namn == namnSplt){
            add = false;
            var randomColor = arrangor[i].color;
            break;
        };
    };
    if(add){
        var randomColor = generateRandomColor();
        arrangor.push({namn: namnSplt, color: randomColor});
    };
    return randomColor;
};
function makeSelect(options, labelText, first, text, val, multiple, id){
    var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'blocker spacer');
        var label = document.createElement('label');
            label.setAttribute('for', id);
            var labelT = document.createTextNode(labelText);
            label.appendChild(labelT);
        wrapper.appendChild(label);
        var select = document.createElement('select');
            select.setAttribute('id', id);
        if(multiple){
            select.setAttribute('multiple', 'multiple');
        };
        if(first){
            var firstOption = document.createElement('option');
                firstOption.setAttribute('value', '');
                var firstOptionT = document.createTextNode(first);
                firstOption.appendChild(firstOptionT);
            select.appendChild(firstOption);
        };
        for (let i = 0; i < options.length; i++) {
            var option = document.createElement('option');
                option.setAttribute('value', options[i][val]);
                var optionT = document.createTextNode(options[i][text]);
                option.appendChild(optionT);
            select.appendChild(option);
        };
        wrapper.appendChild(select);
    return wrapper;
};
function addFilter(){
    arrangor.sort(function(a, b){
        if(a.namn.toLowerCase() < b.namn.toLowerCase()) { return -1; }
        if(a.namn.toLowerCase() > b.namn.toLowerCase()) { return 1; }
        return 0;
    });
    var plats = [{text: 'Digital', val: '1'},{text: 'Fysisk', val: '2'}];
    var wrapper = document.getElementsByClassName('calendarbody')[0];
        var details = document.createElement('details');
            var rubrik = document.createElement('summary');
                var rubrikT = document.createTextNode('Filter');
                rubrik.appendChild(rubrikT);
            details.appendChild(rubrik);
            details.appendChild(makeSelect(plats, 'Format:', 'Både digital & fysisk', 'text', 'val', false, 'valAvPlats'));
            details.appendChild(makeSelect(arrangor, 'Välj arrangörer:', false, 'namn', 'namn', true, 'valAvArrangor'));
            var gratisWrapper = document.createElement('div');
                gratisWrapper.setAttribute('class', 'spacer');
                var gratisCheckbox = document.createElement('input');
                    gratisCheckbox.setAttribute('type', 'checkbox');
                    gratisCheckbox.setAttribute('id', 'valAvAvgift');
                gratisWrapper.appendChild(gratisCheckbox);
                var gratisLabel = document.createElement('label');
                    gratisLabel.setAttribute('for', 'valAvAvgift');
                    var gratisLabelT = document.createTextNode('Avgiftsfria event');
                    gratisLabel.appendChild(gratisLabelT);
                gratisWrapper.appendChild(gratisLabel);
            details.appendChild(gratisWrapper);
            var buttonFilter = document.createElement('input');
                buttonFilter.setAttribute('type', 'button');
                buttonFilter.setAttribute('style', 'margin-top: 15px;margin-right: 10px;');
                buttonFilter.setAttribute('value', 'Applicera filter');
                buttonFilter.setAttribute('onclick', 'appliceraFilter("valAvPlats", "valAvArrangor", "valAvAvgift")')
            details.appendChild(buttonFilter);
            var buttonRensaFilter = document.createElement('input');
                buttonRensaFilter.setAttribute('type', 'button');
                buttonRensaFilter.setAttribute('style', 'margin-top: 15px;background-color: gray;');
                buttonRensaFilter.setAttribute('value', 'Återställ filter');
                buttonRensaFilter.setAttribute('onclick', 'window.open("/kalender.html?", "_self")');
            details.appendChild(buttonRensaFilter);
        wrapper.appendChild(details);
    loadSaved('valAvPlats', 'valAvArrangor', 'valAvAvgift');
};
function loadSaved(platsId, arrangorId, avgiftId){
    var arrangor = getParameterByName('arrangor');
    if(arrangor == null){}else{
        var arrangorSplit = decodeURI(arrangor).split(',');
        for (let i = 0; i < arrangorSplit.length; i++) {
            var allArrangorOptions = document.getElementById(arrangorId).getElementsByTagName('option');
            for (let a = 0; a < allArrangorOptions.length; a++) {
                if(allArrangorOptions[a].value == arrangorSplit[i]){
                    allArrangorOptions[a].selected = true;
                };
            };
        };
    };
    var plats = getParameterByName('format');
    if(plats == null){}else{
        document.getElementById(platsId).value = plats;
    };
    var avgift = getParameterByName('gratis');
    if(avgift == 'true'){
        document.getElementById(avgiftId).checked = true;
    };
};
function appliceraFilter(platsId, arrangorId, avgiftId){
    var url = [];
    var plats = document.getElementById(platsId).value;
    if(plats == ''){}else{url.push('format=' + plats);};
    var arrangorOptions = document.getElementById(arrangorId).getElementsByTagName('option');
    var arrangorer = [];
    for (let i = 0; i < arrangorOptions.length; i++) {
        if(arrangorOptions[i].selected){
            arrangorer.push(arrangorOptions[i].value);
        };
    };
    if(arrangorer.length == 0){}else{url.push('arrangor=' + arrangorer.join(','));};
    var avgift = document.getElementById(avgiftId).checked;
    if(avgift){url.push('gratis=true');};
    window.open(encodeURI('/kalender.html?' + url.join('&')), '_self');
};
function indexArrangor(){
    arrangor.sort(function(a, b){
        if(a.namn.toLowerCase() < b.namn.toLowerCase()) { return -1; }
        if(a.namn.toLowerCase() > b.namn.toLowerCase()) { return 1; }
        return 0;
    });
    var wrapper = document.getElementsByClassName('calendarbody')[0];
        var details = document.createElement('details');
            var rubrik = document.createElement('summary');
                var rubrikT = document.createTextNode('Arrangör');
                rubrik.appendChild(rubrikT);
            details.appendChild(rubrik);
            var table = document.createElement('table');
                table.setAttribute('class', 'min');
                var tBody = document.createElement('tbody');
                for (let i = 0; i < arrangor.length; i++) {
                    var line = document.createElement('tr');
                        var color = document.createElement('td');
                            color.setAttribute('style', 'width: 20px; background-color: ' + arrangor[i].color + ';');
                        line.appendChild(color);
                        var text = document.createElement('td');
                            var textT = document.createTextNode(arrangor[i].namn);
                            text.appendChild(textT);
                        line.appendChild(text);
                    tBody.appendChild(line);
                };
                table.appendChild(tBody);
            details.appendChild(table);
        wrapper.appendChild(details);
        var space = document.createElement('br');
        wrapper.appendChild(space);
};
function getWidthView(){
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(width > 800){
        return 'dayGridMonth';
    }else{
        return 'listWeek';
    };
};
function handleEvent(e) {
    var loader = document.getElementById('calendar');
    removeElements(loader);
    var wrapper = document.getElementsByClassName('calendarbody')[0];
    var p = document.createElement('p');
        p.setAttribute('style', 'padding-bottom: 20px;')
        var pT = document.createTextNode('Data för kalender kunde inte laddas. Testa att ladda om sidan.');
        p.appendChild(pT);
    wrapper.appendChild(p);
    console.log(`Kalender kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
    errorPost(`Kalender kunde inte laddas pga: "${e.type}" (${e.loaded} bytes transferred)`);
};
var loadFile = function (filePath, done) {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener('error', handleEvent);
        xhr.onload = function () { return done(this.responseText) }
        xhr.open("GET", encodeURI(filePath), true);
        xhr.send();
};
    loadFile("/assets/data/kalender.json", function (responseText) {
        var results = JSON.parse(responseText);
        console.log('Kalender: ' + results.latestUpdate);
        var ev = [];
        for (var a = 0; a < results.data.length; a++){
            var color = addArrangor(results.data[a][4]);
            if(filter(results.data[a][4].split(',')[0], results.data[a][5], results.data[a][6])){
                var tColor = getContrast(color);
                var eventtopush = {title: results.data[a][2], start: results.data[a][0], url: results.data[a][3], backgroundColor: color, borderColor: color, textColor: tColor};
                if(!results.data[a][1] || results.data[a][1] == ''){}else{
                    if(results.data[a][1].split('T').length == 2){
                        eventtopush.end = results.data[a][1];
                    }else{
                        var datea = new Date(results.data[a][1]);
                        var dateb = datea.getTime() + (((60*1000)*60)*24);
                        var datec = new Date(dateb);
                        eventtopush.end = dateFormat(datec);
                    };
                };
                ev.push(eventtopush);
            };
        };
        var calendarEl = document.getElementById('calendar');
        var options = {
            locale: 'sv',
            eventDidMount: function(info) {
                info.el.setAttribute('title', info.event['_def'].title)
            },
            headerToolbar: {
                left: 'dayGridMonth,timeGridWeek,listWeek',
                center: 'title',
                right: 'prevYear,prev,next,nextYear'
            },
            views: {
                dayGridMonth: { buttonText: 'Månad' },
                timeGridWeek: { buttonText: 'Vecka' },
                listWeek: { buttonText: 'Lista' }
            },
            initialView: 'dayGridMonth',
            events: ev,
            eventTimeFormat: { 
                hour: '2-digit',
                minute: '2-digit',
                hour12:false
            }
        };
        var vy = getParameterByName('vy');
        if(vy == null){
            options.initialView = getWidthView();
        }else{
            if(vy == 'manad'){
                options.initialView = 'dayGridMonth';
            }else if(vy == 'vecka'){
                options.initialView = 'timeGridWeek';
            }else if(vy == 'dag'){
                options.initialView = 'timeGridDay';
            }else if(vy == 'lista'){
                options.initialView = 'listWeek';
            }else{
                options.initialView = getWidthView();
            };
        };
        var datum = getParameterByName('datum');
        if(datum == null){}else{
            options.initialDate = encodeURI(datum);
        };
        var calendar = new FullCalendar.Calendar(calendarEl, options);
        removeElements(calendarEl);
        calendar.render();
        addFilter();
        indexArrangor();
    });
