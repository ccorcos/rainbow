import loop from "./server/loop"
import { Scene } from "./types"
import * as config from "./config"
import walkScene from "./scenes/walkScene"
import hueSweepScene from "./scenes/hueSweepScene"

const TestScene: Scene<null> = {
	init: () => null,
	update: () => null,
	render: ctx => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, 2, 2)
	},
}

loop(hueSweepScene)
// loop(BounceScene)
