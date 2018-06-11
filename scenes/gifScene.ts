import { Scene } from "../types"
import * as config from "../config"
import { loadGif } from "../assets/load"

let frames: Array<HTMLImageElement> = []

const gifScene: Scene<{ tick: number; frame: number }> = {
	init: async () => {
		if (frames.length === 0) {
			frames = await loadGif("duck.gif")
		}
		return { tick: 0, frame: 0 }
	},
	update: state => ({
		tick: state.tick + 1,
		frame: Math.floor(state.tick / 10) % frames.length,
	}),
	render: (ctx, state) => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		ctx.drawImage(frames[state.frame], 0, 0)
		ctx.drawImage(frames[state.frame], config.width - 15, 5, 15, 15)
	},
}

export default gifScene
