import * as e131 from "e131"
import * as _ from "lodash"
import * as chroma from "chroma-js"
import * as readline from "readline"

const channelsPerPixel = 3
const channelsPerUniverse = 510
const pixelsPerOutput = 550

// Note: Universe, Channel, and Output "numbers" start at 1, but
// the "index" will start at 0

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

// Everything is in output number 4
const outputIndex = 3
const height = 25
const width = 10

function getAddressForPixel(x: number, y: number) {
	const universeIndex = Math.floor(
		pixelsPerOutput * channelsPerPixel / channelsPerUniverse * outputIndex +
			(y * height + x * channelsPerPixel)
	)
	const channelIndex =
		(pixelsPerOutput * channelsPerPixel * outputIndex +
			(y * height + x * channelsPerPixel)) %
		channelsPerUniverse

	return { universeIndex, channelIndex }
}

// universe 10, channel 361
// universe 13, channel 480

const pixelIndexes = getPixelIndexesForOutputIndex(3) // output number 4

// The board only has 250 LEDs.
const pixels = pixelIndexes.slice(0, 250)

// Open Advatek Assistant to connect to the controller and set the static IP
const ipAddress = "192.168.1.69"

var client = new e131.Client(ipAddress) // or use a universe

// Lets color the first 50 red and the second 50 blue.

// const first50 = pixels.slice(0, 50)
// const second50 = pixels.slice(50, 100)

// var packet = client.createPacket(510) // we want 8 RGB (x3) slots
// var slotsData = packet.getSlotsData()
// packet.setUniverse(11)
// // packet.setSourceName("PL1")
// // packet.setOption(packet.Options.PREVIEW, true) // don't really change any fixture
// packet.setPriority(packet.DEFAULT_PRIORITY) // not strictly needed, done automatically

// slotsData[0] = 255
// slotsData[1] = 255
// slotsData[2] = 255
// // slotsData[3] = 255
// // slotsData[4] = 255
// // slotsData[5] = 255
// slotsData[6] = 255
// slotsData[7] = 255
// slotsData[8] = 255
// // slotsData[9] = 255
// // slotsData[10] = 255
// // slotsData[11] = 255

// client.send(packet, function() {
// 	console.log("done")
// })

// Bitmap representing the panel
const bitmap: Array<Array<[number, number, number]>> = Array(height)
	.fill(0)
	.map(() =>
		Array(width)
			.fill(0)
			.map(() => [0, 0, 0] as [number, number, number])
	)

function rainbow(startColor: number) {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			bitmap[row][col] = chroma
				.hsl((startColor + row * 360 / height) % 360, 1, 0.5)
				._rgb.slice(0, 3)
		}
	}
}

function border(inset: number) {
	for (let i = 1; i < height; i++) {
		bitmap[i][inset] = [255, 255, 255]
		bitmap[i][width - 1 - inset] = [255, 255, 255]
	}

	for (let i = 0; i < width; i++) {
		bitmap[1 + inset][i] = [255, 255, 255]
		bitmap[height - 1 - inset][i] = [255, 255, 255]
	}
}

async function renderLeds() {
	const pixels = getPixelIndexesForOutputIndex(3).slice(0, 250)
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

let startColor = 0
const speed = 10

function oneLight(index: number) {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			const on = index === col + row * width
			bitmap[row][col] = on ? [255, 255, 255] : [0, 0, 0]
		}
	}
}

function random() {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			bitmap[row][col] = [
				Math.round(Math.random() * 255),
				Math.round(Math.random() * 255),
				Math.round(Math.random() * 255),
			]
		}
	}
}

function solidColor(color: [number, number, number]) {
	for (let row = 1; row < height; row++) {
		for (let col = 0; col < width; col++) {
			bitmap[row][col] = color
		}
	}
}

async function go(color: [number, number, number]) {
	return new Promise(resolve => {
		const pixels = getPixelIndexesForOutputIndex(3).slice(0, 250)
		const groups = _.groupBy(pixels, pixel => pixel.universeIndex)

		Object.keys(groups).map(universeIndex => {
			const pixelIndexes = groups[universeIndex]
			var packet = client.createPacket(channelsPerUniverse)
			var slotsData = packet.getSlotsData()
			packet.setUniverse(parseInt(universeIndex) + 1)
			pixelIndexes.forEach(pixel => {
				slotsData[pixel.channelIndex] = color[0]
				slotsData[pixel.channelIndex + 1] = color[1]
				slotsData[pixel.channelIndex + 2] = color[2]
			})
			client.send(packet, resolve)
		})

		// await wait()
		// go(next, color)
	})
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

async function test() {
	const colors: Array<[number, number, number]> = [[255, 0, 0], [0, 0, 255]]

	while (true) {
		const color = colors.pop() as [number, number, number]
		await go(color)
		await delay(100)
		colors.unshift(color)
	}
}

async function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

interface startArgs<T> {
	init: T
	update: (state: T) => T
	render: (state: T) => void
	frameRate: number
	debug?: boolean
}

function start<T>({ init, update, render, frameRate, debug }: startArgs<T>) {
	let state = init
	const updateLoop = async () => {
		while (true) {
			state = update(state)
			await render(state)
			if (debug) {
				await wait()
			} else {
				await delay(1 / frameRate * 1000)
			}
		}
	}
	const renderLoop = async () => {
		while (true) {
			await renderLeds()
		}
	}
	updateLoop()
	renderLoop()
}

// start({
// 	init: startColor,
// 	update: color => (color + speed) % 360,
// 	render: color => rainbow(color),
// 	frameRate: 30,
// })

// start({
// 	init: 0,
// 	update: index => (index + 1) % (width * height),
// 	render: index => oneLight(index),
// 	frameRate: 30,
// })

// start({
// 	init: 0,
// 	update: anything => anything,
// 	render: index => random(),
// 	frameRate: 1,
// })

start({
	init: true,
	update: bool => !bool,
	render: bool => solidColor(bool ? [255, 0, 0] : [0, 0, 255]),
	frameRate: 1,
	debug: true,
})

// const change = () => {
// 	// index = (index + 1) % (width * height)
// 	startColor = (startColor + speed) % 360
// 	return wait().then(change)
// }
// wait().then(change)
