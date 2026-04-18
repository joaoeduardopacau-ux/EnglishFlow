import fs from 'node:fs'
import { PDFParse } from 'pdf-parse'

const data = fs.readFileSync('D:/Dowloads/largedictionary.pdf')
const parser = new PDFParse({ data: new Uint8Array(data) })
const result = await parser.getText()
fs.writeFileSync('D:/Dowloads/Claude/scripts/dict-raw.txt', result.text)
console.log('total chars:', result.text.length)

// Procura páginas com conteúdo real
const pages = result.text.split(/-- \d+ of \d+ --/)
let withContent = 0
for (let i = 0; i < pages.length; i++) {
  const t = pages[i].trim()
  if (t.length > 20) {
    withContent++
    if (withContent <= 3) {
      console.log(`\n--- page ${i} (${t.length} chars) ---`)
      console.log(t.slice(0, 500))
    }
  }
}
console.log(`\npages with >20 chars: ${withContent} / ${pages.length}`)
