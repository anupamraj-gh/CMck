import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const contentPath = resolve(scriptDirectory, '../../src/config/content.json')
const outputDirectory = resolve(scriptDirectory, 'generated')
const content = JSON.parse(await readFile(contentPath, 'utf8'))

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function csvDocument(rows) {
  return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`
}

const configRows = [
  ['key', 'json_value'],
  ...Object.entries(content)
    .filter(([key]) => key !== 'products')
    .map(([key, value]) => [key, JSON.stringify(value)]),
]
const productRows = [
  ['json_value'],
  ...content.products.map((product) => [JSON.stringify(product)]),
]

await mkdir(outputDirectory, { recursive: true })
await Promise.all([
  writeFile(resolve(outputDirectory, 'config.csv'), csvDocument(configRows), 'utf8'),
  writeFile(resolve(outputDirectory, 'products.csv'), csvDocument(productRows), 'utf8'),
])

console.log(`Generated Google Sheets CSVs in ${outputDirectory}`)
