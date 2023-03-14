const
	fs = require('fs'),
	log = {
		debug: function () {
			process.stdout.write(new Date().toISOString() + ' - ' + '[DEBUG] - ');
			console.log.apply(console, arguments);
		},
		info: function () {
			process.stdout.write(new Date().toISOString() + ' - ' + '[INFO] - ');
			console.log.apply(console, arguments);
		},
		error: function () {
			process.stdout.write(new Date().toISOString() + ' - ' + '[ERROR] - ');
			console.log.apply(console, arguments);
		}
	}
;

var
	master = fs.readFileSync('templates/master.html').toString(),
	adminfunctions = fs.readFileSync('templates/adminfunctions.html').toString()
;


function generatePage(name, options, callback) {
	var page = fs.readFileSync('templates/' + name + '.html').toString();
	var mastertouse = master;

	if (options && options.master) mastertouse = options.master;

	fs.writeFileSync('dist/'+name+'.html',
		mastertouse
			.replace(/\{\{pagebody\}\}/g, page)
			.replace(/\{\{pagetitle\}\}/g, ((options && options.pagetitle) ? options.pagetitle : '24x7 Stansted - 24x7 Taxi service - Stansted, Braintree, Dunmow, Chelmsford'))
			.replace(/\{\{pagestyles\}\}/g, ((options && options.pagestyles) ? options.pagestyles : ''))
			.replace(/\{\{pagescripts\}\}/g, ((options && options.pagescripts) ? options.pagescripts : ''))
			.replace(/\{\{adminfunctions\}\}/g, ((options && options.adminfunctions) ? options.adminfunctions : adminfunctions))
			.replace(/\{\{pagedescription\}\}/g, ((options && options.pagedescription) ? options.pagedescription : 
				'CCS Shop'
			))
	);

	setTimeout(callback, 0);
}

var d=0, c=0;

function onRet() {
	if (++c === d) {
		log.info('exiting.');
		process.exit(0);
	}
}

function generateIndex() {
	d++;
	generatePage('index', {
	}, onRet);
}

////

function noop() {}

fs.mkdir('dist',0777, noop);

generateIndex();
