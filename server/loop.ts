import { Scene } from "../types"
import * as readline from "readline"
import * as pixelite from "./pixelite"
import * as Canvas from "canvas"
import * as config from "../config"

async function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function wait() {
	return new Promise(resolve => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})

		rl.question("Enter>", () => {
			rl.close()
			resolve()
		})
	})
}

const canvas = new Canvas(config.width, config.height)
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")

const waitMs = 1000 / config.frameRate

export default function loop<T>(scene: Scene<T>, debug = false) {
	let stop = false
	let state = scene.init()

	const innerLoop = async () => {
		while (!stop) {
			if (debug) {
				await wait()
			}
			scene.render(ctx, state)
			await delay(waitMs)
			await pixelite.render(ctx)
			state = scene.update(state)
		}
	}

	innerLoop()
	return () => {
		stop = true
	}
}
