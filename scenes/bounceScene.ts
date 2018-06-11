import { Scene } from "../types"
import * as config from "../config"

const BounceScene: Scene<{ x: number; y: number; dx: number; dy: number }> = {
	init: () => {
		return {
			x: 0,
			y: 0,
			dx: 2,
			dy: 3,
		}
	},
	update: state => {
		var new_dx: number = state.dx
		if (state.x <= 0 && new_dx < 0) {
			new_dx = -state.dx
		} else if (state.x >= config.width - 2 && new_dx > 0) {
			new_dx = -state.dx
		}
		var new_dy: number = state.dy
		if (state.y <= 0 && new_dx < 0) {
			new_dy = -state.dy
		} else if (state.y >= config.height - 2 && new_dx > 0) {
			new_dy = -state.dy
		}
		return {
			x: state.x + state.dx,
			y: state.y + state.dy,
			dx: new_dx,
			dy: new_dy,
		}
	},
	render: (ctx, state) => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.fillStyle = "white"
		ctx.fillRect(state.x, state.y, 2, 2)
	},
}

export default BounceScene
