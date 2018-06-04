export interface Scene<State> {
	init(): State
	update(state: State): State
	render(ctx: CanvasRenderingContext2D, state: State): void
}

export type SceneName = "rgb" | "hueSweep" | "border" | "walk"

export const sceneNames: Array<SceneName> = [
	"hueSweep",
	"rgb",
	"border",
	"walk",
]

export interface Api {
	setScene: {
		input: { scene: SceneName }
		output: {}
	}
}
