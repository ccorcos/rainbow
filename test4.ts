import * as e131 from "e131"
import * as _ from "lodash"
import * as chroma from "chroma-js"
import * as readline from "readline"
import * as fs from "fs"

/*

Pixelite Controller has "output".

e1.31 is a LED UDP protocol.
Each UDP packet has 510 bytes which is 170 pixels.
A group of 170 pixels is called a "universe".

A Pixelite can "output" 550 pixels.
A single "output" contains ~3.23 "universes"
A single controller has 16 outputs.

*/

const pixeliteOutputIndex = 4 // Index is the output number - 1
const height = 25
const width = 10

// Open Advatek Assistant to connect to the controller and set the static IP
const ipAddress = "192.168.1.69"
const client = new e131.Client(ipAddress) // or use a universe

// Note: Universe, Channel, and Output "numbers" start at 1, but
// the "index" will start at 0

const channelsPerPixel = 3
const channelsPerUniverse = 510
const pixelsPerOutput = 550

function getPixelIndexesForOutputIndex(outputIndex: number) {
	const universeStartIndex = Math.floor(
		pixelsPerOutput * channelsPerPixel / channelsPerUniverse * outputIndex
	)
	const channelStartIndex =
		(pixelsPerOutput * channelsPerPixel * outputIndex) % channelsPerUniverse

	const pixelIndexes: Array<{
		channelIndex: number
		universeIndex: number
		index: number
	}> = []

	let index = 0
	let currentUniverseIndex = universeStartIndex
	let currentChannelIndex = channelStartIndex
	for (let i = 0; i < pixelsPerOutput; i++) {
		if (currentChannelIndex >= channelsPerUniverse) {
			currentUniverseIndex += 1
			currentChannelIndex = 0
		}
		pixelIndexes.push({
			index,
			universeIndex: currentUniverseIndex,
			channelIndex: currentChannelIndex,
		})
		index++
		currentChannelIndex += channelsPerPixel
	}
	return pixelIndexes
}

// The board only has 250 LEDs.
const pixels = getPixelIndexesForOutputIndex(4).slice(0, 250)
const groups = _.groupBy(pixels, pixel => pixel.universeIndex)

const Canvas = require("canvas")
const canvas = new Canvas(width, height)
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")

// Save the file to preview when debugging.
function save() {
	const out = fs.createWriteStream(__dirname + "/test.png")
	const stream = canvas.pngStream()
	stream.pipe(out)
	out.on("finish", function() {
		console.log("The PNG file was created.")
	})
}

async function draw() {
	// Draw the canvas
	// ctx.fillStyle = "red"
	// ctx.fillRect(0, 0, width, height)

	// ctx.fillStyle = "red"
	// ctx.font = "6px"
	// ctx.rotate(Math.PI / -2)
	// ctx.fillText("Hello", 1, 1, 20)
	// save()

	ctx.fillStyle = "red"
	ctx.fillRect(0, 0, width / 2, height)
	ctx.fillStyle = "blue"
	ctx.fillRect(width / 2, 0, width / 2, height)

	// Send to controller
	const px = ctx.getImageData(0, 0, width, height)

	return Promise.all(
		Object.keys(groups).map((universeIndex, i) => {
			const pixelIndexes = groups[universeIndex]

			var packet = client.createPacket(channelsPerUniverse)
			var slotsData = packet.getSlotsData()
			packet.setUniverse(parseInt(universeIndex) + 1)

			pixelIndexes.forEach(pixel => {
				const y = pixel.index % height
				const x = Math.floor(pixel.index / height)

				// Pixels zig zag to every other x goes up and down y.
				const bitmapy = x % 2 === 0 ? y : height - 1 - y
				const bitmapx = x

				const index = bitmapy * width * 4 + bitmapx * 4
				slotsData[pixel.channelIndex] = px.data[index]
				slotsData[pixel.channelIndex + 1] = px.data[index + 1]
				slotsData[pixel.channelIndex + 2] = px.data[index + 2]
			})

			// console.log(slotsData)

			return new Promise(resolve => {
				client.send(packet, function() {
					resolve()
				})
			})
		})
	)
}

async function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function wait() {
	return new Promise(resolve => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})

		rl.question("Enter>", () => {
			rl.close()
			resolve()
		})
	})
}

let startColor = 0
let pixelIndex = 0
const speed = 10

async function main() {
	while (true) {
		await wait()
		// await delay(1000 / 60)
		await draw()
		startColor += speed
	}
}

main().catch(console.error)
