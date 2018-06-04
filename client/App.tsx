import * as React from "react"
import scenes from "../scenes"
import Preview from "./Preview"

type SceneName = keyof typeof scenes

const sceneNames = Object.keys(scenes) as Array<SceneName>

export default class App extends React.Component<{}, { scene: SceneName }> {
	state = { scene: "hueSweep" as "hueSweep" }

	setScene = (scene: SceneName) => {
		this.setState({ scene })
	}

	render() {
		return (
			<div>
				<div>
					<Preview key={this.state.scene} scene={this.state.scene} />
				</div>
				{sceneNames.map(sceneName => (
					<button onClick={() => this.setScene(sceneName)}>{sceneName}</button>
				))}
			</div>
		)
	}
}
