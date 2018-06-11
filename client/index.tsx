/* ================================================================================

	The client application starts here.

================================================================================ */

import * as React from "react"
import * as ReactDOM from "react-dom"
import { css } from "glamor"
import App from "./App"

// Set some global CSS.
css.global("html, body", {
	margin: 0,
	padding: 0,
})

css.global("a", {
	color: "inherit",
	textDecoration: "none",
})

css.global("body", {
	margin: "1em 2em",
	fontFamily: '-apple-system, "Helvetica", "Arial", sans-serif',
	color: "#444",
	tabSize: 4,
})

// Render the app.
const root = document.getElementById("root")
ReactDOM.render(<App />, root)
