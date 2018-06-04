import { Scene } from "../types"
import * as config from "../config"

const WalkScene: Scene<{ index: number }> = {
	init: () => ({ index: 0 }),
	update: ({ index }) => ({ index: index + 1 }),
	render: (ctx, { index }) => {
		const row = Math.floor(index / config.width)
		const col = index % config.width
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.fillStyle = "white"
		ctx.fillRect(col, row, 1, 1)
	},
}

export default WalkScene
