/* ================================================================================

	PreviewScene.

================================================================================ */

import * as React from "react"
import scenes from "../scenes/allScenes"
import * as config from "../config"
import { Scene, SceneName } from "../types"

export default class PreviewScene extends React.Component<{
	scene: SceneName
}> {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	sceneState: any
	stop: () => void

	handleRef = node => {
		if (node) {
			this.canvas = node
		}
	}

	componentDidMount() {
		const scene = scenes[this.props.scene] as Scene<any> // TODO: better types
		this.sceneState = scene.init()
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
		this.stop = loop(() => {
			scene.render(this.ctx, this.sceneState)
			this.sceneState = scene.update(this.sceneState)
		})
	}

	componentWillUnmount() {
		this.stop()
	}

	render() {
		return (
			<canvas
				width={config.width}
				height={config.height}
				style={{ height: 300 }}
				ref={this.handleRef}
			/>
		)
	}
}

function loop(fn: () => void) {
	let stop = false
	const innerLoop = async () => {
		while (!stop) {
			// requestAnimationFrame is much smoother, but we can use setTimeout to replicate
			// the behavior on the server and adjusting the frameRate would effect the preview.
			// await new Promise(resolve => requestAnimationFrame(resolve))
			await new Promise(resolve => setTimeout(resolve, 1000 / config.frameRate))
			fn()
		}
	}
	innerLoop()
	return () => {
		stop = true
	}
}
