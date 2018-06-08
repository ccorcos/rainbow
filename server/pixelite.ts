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

function toOffset(args: { universe: number; byte: number }) {
	return args.universe * bytesPerUniverse + args.byte
}

function fromOffset(offset: number) {
	return {
		universe: Math.floor(offset / bytesPerUniverse),
		byte: offset % bytesPerUniverse,
	}
}

// Note: Universe and Output "numbers" start at 1, but the "index" will start at 0
function getPixelIndexesForOutputIndex(outputIndex: number) {
	const startOffset = pixelsPerOutput * bytesPerPixel * outputIndex
	return Array(pixelsPerOutput)
		.fill(0)
		.map((_, index) => {
			const pixelOffset = startOffset + index * bytesPerPixel
			const { universe, byte } = fromOffset(pixelOffset)
			return { universe, byte, index }
		})
}

// The text board only has 250 LEDs.
const pixels = getPixelIndexesForOutputIndex(config.pixeliteOutputIndex).slice(
	0,
	config.width * config.height
)

// console.log(
// 	JSON.stringify(
// 		getPixelIndexesForOutputIndex(config.pixeliteOutputIndex),
// 		undefined,
// 		2
// 	)
// )

const groups = _.groupBy(pixels, pixel => pixel.universe)

function getImageDataOffset(args: { x: number; y: number }) {
	return (args.y * config.width + args.x) * 4
}

// console.log(getImageDataOffset({ y: 0, x: 0 }), 0)
// console.log(getImageDataOffset({ y: 0, x: 1 }), 4)
// console.log(getImageDataOffset({ y: 1, x: 0 }), 4 * config.width)

function pixelIndexToXY(index: number) {
	// 0 => {width, height}
	// height - 1 => {width, 0}
	let y = index % config.height
	let x = Math.floor(index / config.height)
	// The first pixel is on the right size, so we want to flip the column.
	x = config.width - x - 1
	// Even columns go backwards
	y = x % 2 === 1 ? y : config.height - y - 1
	return { x, y }
}

// console.log(pixelIndexToRowCol(0), {
// 	row: config.height - 1,
// 	col: config.width - 1,
// })
// console.log(pixelIndexToRowCol(config.height - 1), {
// 	row: 0,
// 	col: config.width - 1,
// })

// Render the cavnas to the LED panel.
export async function render(ctx: CanvasRenderingContext2D) {
	// Send to controller
	const imageData = ctx.getImageData(0, 0, config.width, config.height).data
	return Promise.all(
		Object.keys(groups).map((universe, i) => {
			const pixels = groups[universe]

			var packet = client.createPacket(bytesPerUniverse)
			var slotsData = packet.getSlotsData()
			packet.setUniverse(parseInt(universe) + 1) // Universes are indexed at 1

			pixels.forEach(pixel => {
				const { x, y } = pixelIndexToXY(pixel.index)
				const offset = getImageDataOffset({ x, y })

				if (imageData[offset] === 255) {
					console.log({
						index: pixel.index,
						x,
						y,
						imgIndex: offset,
						imgData: [
							imageData[offset],
							imageData[offset + 1],
							imageData[offset + 2],
						],
						universe,
						byte: pixel.byte,
					})
				}

				slotsData[pixel.byte] = imageData[offset]
				slotsData[pixel.byte + 1] = imageData[offset + 1]
				slotsData[pixel.byte + 2] = imageData[offset + 2]
			})

			return new Promise(resolve => client.send(packet, resolve))
		})
	)
}
