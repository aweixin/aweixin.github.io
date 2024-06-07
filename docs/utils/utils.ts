import fs from "fs"

// 获取指定目录下的文件
export function getFiles(dir: string) {
    const files = fs.readdirSync('./docs/src/' + dir)
    let sortFiles = []
    files.forEach(file => {
        sortFiles.push({
            text: file.replace('.md', ''),
            link: dir + '/' + file
        })
    })
    console.log(sortFiles)
    return sortFiles
}