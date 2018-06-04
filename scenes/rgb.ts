import { Scene } from "../types"
import * as config from "../config"

const RGBScene: Scene<{ index: number }> = {
	init: () => ({ index: 0 }),
	update: ({ index }) => ({ index: (index + 1) % 3 }),
	render: (ctx, { index }) => {
		ctx.fillStyle = ["red", "green", "blue"][index]
		ctx.fillRect(0, 0, config.width, config.height)
	},
}

export default RGBScene
