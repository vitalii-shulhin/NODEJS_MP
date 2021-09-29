import readline from 'readline';
import process from 'process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n Reverse of Sring in NodeJS \n');

rl.prompt();

try {
    rl.on('line', (line) => {
        const reversedLine = line.split('').reverse().join('');
    
        console.log(reversedLine);
        rl.prompt();
    }).on('close', () => {
        console.log('close task1');
    });
} catch (err) {
    console.error(`Error: ${err}`);
}


// reverse of string with rl.question
// const reverse = () => {
//     rl.question('', function (str) {
//         const reversedStr = str.split('').reverse().join('');

//         console.log(reversedStr);
//         console.log('\n');

//         reverse();
//     }); 
// }

// reverse();