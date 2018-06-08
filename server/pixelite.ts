import * as e131 from "e131"
import * as _ from "lodash"
import * as chroma from "chroma-js"
import * as readline from "readline"
import * as fs from "fs"
import * as config from "../config"

// Open Advatek Assistant to connect to the controller find set the static IP
const client = new e131.Client(config.pixeliteIpAddress) // or use a universe

/*

e1.31 is a UDP protocol for controlling LEDs.
Each UDP packet has 510 bytes which is 170 pixels.
A group of 170 pixels is called a "universe".

The Pixelite controller has 16 "outputs".
Each "output" can handle 550 pixels.
A single "output" contains ~3.23 "universes".

*/

const bytesPerPixel = 3
const bytesPerUniverse = 510
const pixelsPerOutput = 550

// Note: Universe and Output "numbers" start at 1, but the "index" will start at 0
function getPixelIndexesForOutputIndex(outputIndex: number) {
	const universeStartIndex = Math.floor(
		((pixelsPerOutput * bytesPerPixel) / bytesPerUniverse) * outputIndex
	)
	const byteStartIndex =
		(pixelsPerOutput * bytesPerPixel * outputIndex) % bytesPerUniverse

	const pixelIndexes: Array<{
		byteIndex: number
		universeIndex: number
		index: number
	}> = []

	let index = 0
	let currentUniverseIndex = universeStartIndex
	let currentByteIndex = byteStartIndex
	for (let i = 0; i < pixelsPerOutput; i++) {
		if (currentByteIndex >= bytesPerUniverse) {
			currentUniverseIndex += 1
			currentByteIndex = 0
		}
		pixelIndexes.push({
			index,
			universeIndex: currentUniverseIndex,
			byteIndex: currentByteIndex,
		})
		index++
		currentByteIndex += bytesPerPixel
	}
	return pixelIndexes
}

// The text board only has 250 LEDs.
const pixels = getPixelIndexesForOutputIndex(config.pixeliteOutputIndex).slice(
	0,
	config.width * config.height
)
const groups = _.groupBy(pixels, pixel => pixel.universeIndex)

// Render the cavnas to the LED panel.
export async function render(ctx: CanvasRenderingContext2D) {
	// Send to controller
	const px = ctx.getImageData(0, 0, config.width, config.height)
	return Promise.all(
		Object.keys(groups).map((universeIndex, i) => {
			const pixelIndexes = groups[universeIndex]

			var packet = client.createPacket(bytesPerUniverse)
			var slotsData = packet.getSlotsData()
			packet.setUniverse(parseInt(universeIndex) + 1)

			pixelIndexes.forEach(pixel => {
				const y = pixel.index % config.height
				const x = Math.floor(pixel.index / config.height)

				// Pixels zig zag to every other x goes up and down y.
				const bitmapy = x % 2 === 0 ? y : config.height - 1 - y
				const bitmapx = x

				const index = bitmapy * config.width * 4 + bitmapx * 4
				slotsData[pixel.byteIndex] = px.data[index]
				slotsData[pixel.byteIndex + 1] = px.data[index + 1]
				slotsData[pixel.byteIndex + 2] = px.data[index + 2]
			})

			return new Promise(resolve => client.send(packet, resolve))
		})
	)
}
