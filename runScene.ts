/* ================================================================================

	./node_modules/.bin/ts-node runScene.ts --scene=walkScene

================================================================================ */

import loop from "./server/loop"
import allScenes from "./scenes/allScenes"
import * as minimist from "minimist"

const argv = minimist(process.argv.slice(2))

if (!argv.scene) {
	throw new Error("Please provide a --scene option.")
}

if (!allScenes[argv.scene]) {
	throw new Error("Unknown scene.")
}

loop(allScenes[argv.scene])
