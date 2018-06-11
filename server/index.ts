/* ================================================================================

	The server application starts here.

================================================================================ */

import * as Bundler from "parcel-bundler"
import * as express from "express"
import * as bodyParser from "body-parser"
import * as path from "path"
import { Api, Scene } from "../types"
import loop from "./loop"
import scenes from "../scenes/allScenes"

const app = express()

// parse application/json
app.use(bodyParser.json())

// Set up an api handler
function handler<T extends keyof Api>(
	name: T,
	fn: (input: Api[T]["input"]) => Promise<Api[T]["output"]>
) {
	app.post(`/api/${name}`, async (req, res) => {
		console.log(name, req)
		const result = await fn(req.body)
		res.json(result)
	})
}

// Keep track of the current running render loop.
let stopCurrentLoop: () => void | undefined

handler("setScene", async ({ scene }) => {
	if (stopCurrentLoop) {
		stopCurrentLoop()
	}
	stopCurrentLoop = loop(scenes[scene] as Scene<any>) // TODO: better types
	return {}
})

// Build and serve the client.
const bundler = new Bundler(path.resolve(__dirname, "../client/index.html"))
app.use(bundler.middleware())

app.listen(8080)
