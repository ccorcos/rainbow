import * as Bundler from "parcel-bundler"
import * as express from "express"
import * as path from "path"

const app = express()

const bundler = new Bundler(path.resolve(__dirname, "../client/index.html"))

app.use(bundler.middleware())

app.listen(8080)
