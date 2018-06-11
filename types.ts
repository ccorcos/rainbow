import { SceneName } from "./scenes/allScenes"

export interface Scene<State> {
	init(): State
	update(state: State): State
	render(ctx: CanvasRenderingContext2D, state: State): void
}

export interface Api {
	setScene: {
		input: { scene: SceneName }
		output: {}
	}
}
