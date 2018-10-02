const fs = require('fs')

const entry = './src/';
const output = './pages/';
let oldFile

const filetypes = ['js', 'wxml', 'wxss']


function create(dir) {
  const file = fs.readdirSync(dir)
  file.forEach(file => {
    const stat = fs.statSync(dir + file)
    entryName = `${dir}${file}`
    outputName = `${dir.replace('src', 'pages')}${file}`
    if (stat.isFile()) {
      updateCode(entryName, outputName)
    } else {
      !fs.existsSync(outputName) && fs.mkdirSync(outputName)
      create(`${dir}${file}/`)
    }
  });
}
create(entry)

fs.watch(entry, { recursive: true }, (eventType, filename) => {
  // console.log(`事件类型是: ${eventType}`);
  // if (filename) {
  //   console.log(`提供的文件名: ${filename}`);
  // } else {
  //   console.log('未提供文件名');
  // }

  entryName = `${entry}${filename}`
  outputName = `${output}${filename}`

  try {
    if (eventType === 'change') {
      updateCode(entryName, outputName)
    }
    if (eventType === 'rename') {
      if (fs.existsSync(entryName)) {
        if (filename.indexOf('.') < 0) {
          fs.mkdirSync(outputName)
        } else {
          updateCode(entryName, outputName)
        }
      } else {
        if (filename.indexOf('.') < 0) {
          fs.existsSync(outputName) && fs.rmdirSync(outputName)
        } else {
          filetypes.forEach(type => {
            const outputFilename = `${outputName.slice(0, outputName.lastIndexOf('.'))}.${type}`;
            fs.existsSync(outputFilename) && fs.unlinkSync(outputFilename)
          })
        }
      }
    }
  } catch (e) {
    console.log(e)
  }

})

function updateCode(entryName, outputName){
  const code = fs.readFileSync(entryName, 'utf-8')
  const tags = {
    'wxml': 'template',
    'js': 'script',
    'wxss': 'style'
  }
  const filepath = outputName.slice(0, outputName.lastIndexOf('.'))
  filetypes.forEach(type => {
    file = `${filepath}.${type}`
    !fs.existsSync(file) && fs.appendFileSync(file)
    const data = code ? getCode(code, tags[type]) : ''
    // console.log(type + ':' + code)
    fs.writeFileSync(file, data)
  })
}

function getCode(code, tag) {
  const startTag = `<${tag}>`
  const endTag = `</${tag}>`
  const start = code.indexOf(startTag) + startTag.length
  code = code.slice(start, code.indexOf(endTag))
  if (start < 0) return;
  if (tag === 'script') {
    console.log(code)
    const esprima = require('esprima');
    const estraverse = require('estraverse');
    const ast = esprima.tokenize(code);
    estraverse.traverse(ast, {
      enter(node) {
        console.log(node)
        // node.left && console.log(node.left.value + node.value)
      }
    })
    var escodegen = require("escodegen")
    var code = escodegen.generate(ast)
  }
  return code
}