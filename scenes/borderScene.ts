import { Scene } from "../types"
import * as config from "../config"

const borderScene: Scene<null> = {
	init: () => null,
	update: () => null,
	render: ctx => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.strokeStyle = "white"
		ctx.strokeRect(0, 0, config.width, config.height)
	},
}

export default borderScene
