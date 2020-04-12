const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

//assign an event
eventEmitter.on('greeting', (time) => {
	console.log("Hi Good "+ time);
});

//emit an event
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

//create a new Person instance which is also an instance of EventEmitter
let rahul = new Person('Rahul');
let satya = new Person('Satya');

//assign an event
rahul.on('name', () => {
	console.log("My name is " + rahul.name);
});

satya.on('name', () => {
	console.log("My name is " + satya.name);
});

//emit an event
rahul.emit('name');
satya.emit('name');