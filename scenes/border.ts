import { Scene } from "../types"
import * as config from "../config"

const BorderScene: Scene<null> = {
	init: () => null,
	update: () => null,
	render: ctx => {
		ctx.strokeRect(0, 0, config.width, config.height)
	},
}

export default BorderScene
