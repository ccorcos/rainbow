import * as React from "react"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"

export default class App extends Component {
	count = new Value(0)

	increment = () => {
		this.count.update(count => count + 1)
	}

	decrement = () => {
		this.count.update(count => count - 1)
	}

	view() {
		return (
			<div>
				<button onClick={this.decrement}>{"-"}</button>
				<span>{this.count.get()}</span>
				<button onClick={this.increment}>{"+"}</button>
			</div>
		)
	}
}
