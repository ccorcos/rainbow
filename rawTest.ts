import * as e131 from "e131"

const client = new e131.Client("192.168.1.69") // or use a universe

async function send() {
	for (let i = 1; i <= 500; i++) {
		var packet = client.createPacket(510)
		var slotsData = packet.getSlotsData()
		packet.setUniverse(i)
		for (let i = 0; i < slotsData.length; i += 2) {
			slotsData[i] = 255
		}
		await new Promise(resolve => client.send(packet, resolve))
	}
	console.log("done")
	process.exit(0)
}

send()
