import rgbScene from "./rgbScene"
import hueSweepScene from "./hueSweepScene"
import borderScene from "./borderScene"
import walkScene from "./walkScene"
import zoomScene from "./zoomScene"
import bounceScene from "./bounceScene"
import particleScene from "./particleScene"

const scenes = {
	bounceScene,
	particleScene,
	zoomScene,
	rgbScene,
	hueSweepScene,
	borderScene,
	walkScene,
}

export type SceneName = keyof typeof scenes

export const sceneNames = Object.keys(scenes) as Array<SceneName>

export default scenes
