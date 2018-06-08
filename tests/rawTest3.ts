import * as e131 from "e131"

const client = new e131.Client("192.168.1.69") // or use a universe

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

// console.log(getPixelIndexesForOutputIndex(4)[0])
// console.log(toOffset(getPixelIndexesForOutputIndex(4)[0]))

const min = toOffset(getPixelIndexesForOutputIndex(4)[0])
const max = min + 450 * 3

async function send() {
	let i = min
	while (true) {
		var packet = client.createPacket(510)
		var slotsData = packet.getSlotsData()
		const { universe, byte } = fromOffset(i)
		packet.setUniverse(universe)
		slotsData[byte] = 255
		await new Promise(resolve => client.send(packet, resolve))
		i += 3
		if (i >= max) {
			i = min
		}
		await new Promise(resolve => setTimeout(resolve, 100))
	}
}

send()
