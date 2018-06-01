import * as e131 from "e131"
import * as _ from "lodash"
import * as chroma from "chroma-js"
import * as readline from "readline"

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

// Bitmap representing the panel
const bitmap: Array<Array<[number, number, number]>> = Array(height)
	.fill(0)
	.map(() =>
		Array(width)
			.fill(0)
			.map(() => [0, 0, 0] as [number, number, number])
	)

function renderRainbow(startColor: number) {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			bitmap[row][col] = chroma
				.hsl((startColor + row * 360 / height) % 360, 1, 0.5)
				._rgb.slice(0, 3)
		}
	}
}

function renderBorder(inset: number) {
	for (let i = 1; i < height; i++) {
		bitmap[i][inset] = [255, 255, 255]
		bitmap[i][width - 1 - inset] = [255, 255, 255]
	}

	for (let i = 0; i < width; i++) {
		bitmap[1 + inset][i] = [255, 255, 255]
		bitmap[height - 1 - inset][i] = [255, 255, 255]
	}
}

function renderOneLight(index: number) {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			const on = index === col + row * width
			bitmap[row][col] = on ? [255, 255, 255] : [0, 0, 0]
		}
	}
}

async function draw() {
	const groups = _.groupBy(pixels, pixel => pixel.universeIndex)
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
				const color = bitmap[x % 2 === 0 ? y : height - 1 - y][x] // 51 is 1, 101 is 2
				slotsData[pixel.channelIndex] = color[0]
				slotsData[pixel.channelIndex + 1] = color[1]
				slotsData[pixel.channelIndex + 2] = color[2]
			})

			return new Promise(resolve => {
				client.send(packet, function() {
					resolve()
				})
			})
		})
	)
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
const speed = 10

async function main() {
	while (true) {
		await wait()
		renderRainbow(startColor)
		await draw()
		startColor += speed
	}
}

main().catch(console.error)
