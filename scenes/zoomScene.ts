import { Scene } from "../types"
import * as config from "../config"

const colors = ["red", "orange", "yellow", "green", "blue", "purple"]

const zoomScene: Scene<{ inset: number; direction: 1 | -1 }> = {
	init: () => ({ inset: 0, direction: 1 }),
	update: state => {
		if (state.direction === -1 && state.inset === 0) {
			state.inset = 1
			state.direction = 1
			return state
		}
		if (
			state.direction === 1 &&
			state.inset === Math.floor(Math.min(config.width, config.height) / 2)
		) {
			state.direction = -1
			state.inset -= 1
			return state
		}
		state.inset += state.direction
		return state
	},
	render: (ctx, { inset }) => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
		ctx.strokeRect(
			inset,
			inset,
			config.width - 2 * inset,
			config.height - 2 * inset
		)
	},
}

export default zoomScene
