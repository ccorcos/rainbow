/* ================================================================================

	Attempt to walk through every LED start
	./node_modules/.bin/ts-node tests/rawTest2.ts

================================================================================ */

import * as e131 from "e131"

// Open Advatek Assistant. Check out the start universe and channel for the
// output from the pixelite and this will iterate through them.

const startUniverse = 13
const startByte = 481
const numPixels = 450

const client = new e131.Client("192.168.1.69") // or use a universe

function toOffset(args: { universe: number; byte: number }) {
	return args.universe * 510 + args.byte
}

function fromOffset(offset: number) {
	return {
		universe: Math.floor(offset / 510),
		byte: offset % 510,
	}
}

const min = toOffset({ universe: startUniverse, byte: startByte })
const max = min + numPixels * 3

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
