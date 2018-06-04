import { Scene } from "../types"
import * as config from "../config"
import * as chroma from "chroma-js"

const speed = 10

const HueSweepScene: Scene<{ startColor: number }> = {
	init: () => ({ startColor: 0 }),
	update: ({ startColor }) => ({ startColor: startColor + speed }),
	render: (ctx, { startColor }) => {
		for (let row = 1; row < config.height; row++) {
			for (let col = 0; col < config.width; col++) {
				ctx.fillStyle = chroma.hsl(
					(startColor + row * 360 / config.height) % 360,
					1,
					0.5
				)
				ctx.fillRect(col, row, 1, 1)
			}
		}
	},
}

export default HueSweepScene
