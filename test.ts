import loop from "./server/loop"
import { Scene } from "./types"
import * as config from "./config"
import WalkScene from "./scenes/walk"

const TestScene: Scene<null> = {
	init: () => null,
	update: () => null,
	render: ctx => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, config.width, config.height)
	},
}

loop(WalkScene, true)
// loop(TestScene, true)
