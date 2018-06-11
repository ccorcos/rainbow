import { Scene } from "../types"
import * as config from "../config"

const rainbow = ["red", "#ff4c00", "yellow", "green", "blue", "purple"]

const rainbowScene: Scene<{}> = {
	init: () => ({}),
	update: state => {
		return state
	},
	render: ctx => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		for (let i = 0; i < rainbow.length; i++) {
			ctx.fillStyle = rainbow[rainbow.length - i - 1]
			ctx.fillRect(
				0,
				(i * config.height) / rainbow.length,
				config.width,
				config.height / rainbow.length
			)
		}
	},
}

export default rainbowScene
