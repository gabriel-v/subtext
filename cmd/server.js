import crypto from 'crypto'
import express from 'express'
import waiter from '../src/waiter.js'
import {index} from '../src/build.js'
import createServer from '../src/server/create.js'

const BUILD = `${__dirname}/build`
const UI_JS = process.env.SUBTEXT_UI_JS || 'ui.js'

function getIndex() {
  let data = fs.readFileSync(`${BUILD}/ui.js`)
  let hash = crypto.createHash(data).digest('hex')
  return index(UI_JS, hash)
}

waiter((async function() {

  let [varPath, publicUrl, cmd] = process.argv.slice(2)

  let { app } = await createServer(varPath, publicUrl)

  app.get('/', function(req, res) { res.send(getIndex()) })
  app.use(express.static(BUILD))

})())