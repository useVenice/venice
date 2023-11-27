#!/usr/bin/env node
import fs from 'node:fs'

/**
 * This is used to workaround the fact that many applications such as
 * webpack does not natively know how to import / bundle JSON files
 * And we also don't want to use something ugly heavy handed like a roll up
 * So simpliest solution is to rewrite the JSON file as a JS file
 */
const jsonFileName = process.argv[2]

if (!jsonFileName) {
  console.error('Please provide a JSON file name as a command line argument.')
  process.exit(1)
}

try {
  const jsonData = fs.readFileSync(jsonFileName, 'utf8')
  const jsFileName = `${jsonFileName}.js`
  const jsContent = `module.exports = \n${jsonData}`

  fs.writeFileSync(jsFileName, jsContent, 'utf8')
  fs.rmSync(jsonFileName)

  console.log(`Successfully generated ${jsFileName} with JSON content.`)
} catch (err) {
  console.error('An error occurred while generating the JavaScript file:', err)
  process.exit(1)
}


// TODO: There is additional problem where tsc does not copy .d.ts files to build, and therefore we
// need to do it manully
// https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build
