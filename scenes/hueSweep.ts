import { Scene } from "../types"
import * as config from "../config"
import * as chroma from "chroma-js"

const speed = 10

const HueSweepScene: Scene<{ startColor: number }> = {
	init: () => ({ startColor: 0 }),
	update: ({ startColor }) => ({ startColor: startColor + speed }),
	render: (ctx, { startColor }) => {
		for (let y = 0; y < config.height; y++) {
			for (let x = 0; x < config.width; x++) {
				ctx.fillStyle = chroma
					.hsl((startColor + (y * 360) / config.height) % 360, 1, 0.5)
					.toString()
				ctx.fillRect(x, y, 1, 1)
			}
		}
	},
}

export default HueSweepScene
