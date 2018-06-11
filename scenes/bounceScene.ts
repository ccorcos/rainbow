import { Scene } from "../types"
import * as config from "../config"

const size = 2

const bounceScene: Scene<{ x: number; y: number; dx: number; dy: number }> = {
	init: () => {
		return {
			x: 0,
			y: 0,
			dx: 2,
			dy: 3,
		}
	},
	update: state => {
		if (state.x <= 0 && state.dx < 0) {
			state.dx = -state.dx
		} else if (state.x >= config.width - size && state.dx > 0) {
			state.dx = -state.dx
		}
		if (state.y <= 0 && state.dy < 0) {
			state.dy = -state.dy
		} else if (state.y >= config.height - size && state.dy > 0) {
			state.dy = -state.dy
		}
		state.x += state.dx
		state.y += state.dy
		return state
	},
	render: (ctx, state) => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.fillStyle = "white"
		ctx.fillRect(state.x, state.y, size, size)
	},
}

export default bounceScene
