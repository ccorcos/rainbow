/* ================================================================================

	App.

================================================================================ */

import * as React from "react"
import PreviewScene from "./PreviewScene"
import { SceneName, sceneNames } from "../scenes/allScenes"
import * as config from "../config"

import * as api from "./api"

export default class App extends React.Component<{}, { scene: SceneName }> {
	state = { scene: config.startScene }

	setScene = (scene: SceneName) => {
		this.setState({ scene })
		api.setScene({ scene })
	}

	render() {
		return (
			<div>
				<div>
					<PreviewScene key={this.state.scene} scene={this.state.scene} />
				</div>
				{sceneNames.map(sceneName => (
					<button key={sceneName} onClick={() => this.setScene(sceneName)}>
						{sceneName}
					</button>
				))}
			</div>
		)
	}
}
