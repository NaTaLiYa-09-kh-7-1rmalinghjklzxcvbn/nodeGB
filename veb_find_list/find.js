const fs = require('fs')
const fsp = require('fs/promises')
const http = require('http')
const path = require('path')
const { Transform } = require('stream')

const currentDir = process.cwd()

const links = (arr, pah) => {
    if (pah.endsWith('/')) pah = pah.substring(0, pah.length - 1)
    let list = ''
    for (const el of arr) {
        list += `<h3><a href="${pah}/${el}">${el}</a></h3>`
    }
    return list
}

http.createServer((req, res) => {
    if (req.method === 'GET') {
        const pathUrl = req.url.split('?')[0]
        const filePath = path.join(currentDir, pathUrl)
        console.log(pathUrl)
        fs.stat(filePath, (err, stats) => {
            if (!err) {
                if (stats.isFile(filePath)) {
                    const readFile = fs.createReadStream(filePath, 'utf-8')
                    readFile.pipe(res)
                } else {
                    fsp.readdir(filePath)
                        .then((pat) => {
                            if (pathUrl !== '/') {
                                pat.unshift('..')
                            }
                            return pat
                        })
                        .then((data) => {
                            const filePath = path.join(currentDir, './lessons/veb_find_list/index.html')
                            const readDir = fs.createReadStream(filePath)

                            const ts = new Transform({
                                transform(chunk, encoding, callback) {
                                    const li = links(data, pathUrl)
                                    this.push(chunk.toString().replace('#list#', li))
                                    callback()
                                }
                            })
                            readDir.pipe(ts).pipe(res)
                        })
                }
            } else {
                res.end('Err path')
            }
        })
    }

}).listen(5000, 'localhost', () => console.log('server started'))



