import * as React from "react"
import Preview from "./Preview"
import { SceneName, sceneNames } from "../types"
import * as api from "./api"

export default class App extends React.Component<{}, { scene: SceneName }> {
	state = { scene: "hueSweep" as "hueSweep" }

	setScene = (scene: SceneName) => {
		this.setState({ scene })
		api.setScene({ scene })
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
