const fs = require('fs/promises')
const { lstatSync } = require('fs')
const inquirer = require('inquirer')
const path = require('path')
const colors = require('colors')

let currentDir = process.cwd()

class ListItem {
    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;
    }
    get isDir() {
        return lstatSync(this.path).isDirectory()
    }
}

const run = async () => {
    const list = await fs.readdir(currentDir)
    const items = list.map(fileName =>
        new ListItem(path.join(currentDir, fileName), fileName));

    await inquirer
        .prompt([{
            name: 'fileName',
            type: 'list',
            massage: `Choose: ${currentDir}`,
            choices: items.map(item => ({ name: item.fileName, value: item }))
        },
        ])
        .then(async (answer) => {
            const { fileName } = answer
            if (fileName.isDir) {
                currentDir = fileName.path;
                await run();
                return Promise.reject()
            }
            return fileName
        })
        .then(async (fileName) => {
            await inquirer
                .prompt([
                    {
                        name: "findString",
                        type: "input",
                        message: "Enter something for search",
                    },
                ])
                .then(async (answer) => {
                    const { findString } = answer
                    const fileContent = await fs.readFile(fileName.path, 'utf-8')
                    if (findString) {
                        const replaceValue = fileContent.replaceAll(findString, colors.red(findString))
                        console.log(replaceValue)
                    } else {
                        console.log(fileContent)
                    }
                })
        }).catch(() => { })
}
run();

