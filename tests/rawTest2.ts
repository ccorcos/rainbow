import * as e131 from "e131"

const client = new e131.Client("192.168.1.69") // or use a universe

// Open Advatek Assistant. Check out the start universe and channel for the
// output from the pixelite and this will iterate through them.
// universe 13
// byte offset 181

function toOffset(args: { universe: number; byte: number }) {
	return args.universe * 510 + args.byte
}

function fromOffset(offset: number) {
	return {
		universe: Math.floor(offset / 510),
		byte: offset % 510,
	}
}

const min = toOffset({ universe: 13, byte: 481 })
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
