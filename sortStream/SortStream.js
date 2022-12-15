const fs = require('fs')
const readline = require('readline')

const readStream = fs.createReadStream('./stream.log', 'utf8')

const writeFile1 = fs.createWriteStream('./ip89str.log', {
    encoding: 'utf8',
    flags: 'a'
})

const writeFile2 = fs.createWriteStream('./ip34str.log', {
    encoding: 'utf8',
    flags: 'a'
})

const rl = readline.createInterface({
    input: readStream,
    terminal: false
})


rl.on('line', line => {
    if (line.includes('89.123.1.41')) {
        writeFile1.write(line + '\n')
    }
    if (line.includes('34.48.240.111')) {
        writeFile2.write(line + '\n')
    }

})