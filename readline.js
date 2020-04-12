const readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout});

const num1 = Math.floor((Math.random() * 10) + 1);
const num2 = Math.floor((Math.random() * 10) + 1);

let ans = num1 + num2;

rl.question(`What is the sum of ${num1} + ${num2}? \n`, (userInput) => {

	if (userInput.trim() == ans) {
		rl.close();
		rl.removeAllListeners();
	}else {
		rl.setPrompt("You are wrong, Try again  \n");
		rl.prompt();
		rl.on('line', (userInput) => {
		if (userInput.trim() == ans) {
			rl.close();
		}else {
			rl.setPrompt("You are wrong, Try again  \n");
			rl.prompt();
		}
		})
	}
})

rl.on('close', () => {
	console.log("You are correct, The answer is  \n", ans);
})