import * as Bundler from "parcel-bundler"
import * as express from "express"
import * as bodyParser from "body-parser"
import * as path from "path"
import { Api, Scene } from "../types"
import loop from "./loop"
import scenes from "../scenes"

const app = express()

// parse application/json
app.use(bodyParser.json())

// Api
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

let currentLoop: () => void | undefined

handler("setScene", async ({ scene }) => {
	if (currentLoop) {
		currentLoop()
	}
	console.log("set scene", scene)
	currentLoop = loop(scenes[scene] as Scene<any>) // TODO: better types
	return {}
})

// Build and server the app.
const bundler = new Bundler(path.resolve(__dirname, "../client/index.html"))
app.use(bundler.middleware())

app.listen(8080)
