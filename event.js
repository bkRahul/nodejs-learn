const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('greeting', (time) => {
	console.log("Hi Good "+ time);
});

eventEmitter.emit('greeting', 'Evening');

class Person extends EventEmitter {
	constructor(name) {
		super();
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

let rahul = new Person('Rahul');
let satya = new Person('Satya');

rahul.on('name', () => {
	console.log("My name is " + rahul.name);
});

satya.on('name', () => {
	console.log("My name is " + satya.name);
});

rahul.emit('name');
satya.emit('name');