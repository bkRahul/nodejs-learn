const myName = () => {
	console.log("Rahul");
}

const myAddress = "RPC Layout Vijaynagar";

const salary = (a, b) => a + b;

class MyDetails {
	constructor() {
		console.log("Object is created")
	}

}


module.exports.myName = myName;

module.exports.myAddress = myAddress;

module.exports.mySalary = salary;

module.exports.MyDetails = MyDetails;
