const colors = require('colors')
const argv1 = process.argv[2];
const argv2 = process.argv[3];
if (isNaN(argv1) || isNaN(argv2)) {
    console.log('аргумент не является число')
    return
}

const isPrime = (num) => {
    if (num < 2) {
        return false
    }
    for (let i = 2; i < num; i++)
        if (num % i == 0) return false
    return true
}

const numbers = [];

for (let i = argv1; i < argv2; i++)
    if (isPrime(i)) {
        numbers.push(i)
    }
console.log(colors.red('Простых чисел в диапазоне нет'));

numbers.map((item, index) => {
    let result = (index + 1) % 3
    switch (result) {
        case 1: console.log(colors.red(item))
            break
        case 2: console.log(colors.yellow(item))
            break
        case 0: console.log(colors.green(item))
            break
    }
})