import * as e131 from "e131"
import * as _ from "lodash"
import * as chroma from "chroma-js"
import * as readline from "readline"

// Open Advatek Assistant to connect to the controller and set the static IP
const IP_ADDRESS = "192.168.1.69"
const client = new e131.Client(IP_ADDRESS)

// Documentation: http://www.advateklights.com/pixlite-control/
// Pixelite can output 16320 rgb pixels.
// E131 has 510 bytes per packet/universe or 170 rgb outputs per universe.
// 96 universes for the entire board.

const UNIVERSES = 96

// Wait for enter from the commandline.
function wait() {
	return new Promise(resolve => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})

		rl.question("press enter:", () => {
			rl.close()
			resolve()
		})
	})
}

// Offset rotates the colors through red, green, and blue.
let offset = 0

// Render a solid color to every pixel.
function render() {
	// Iterate through every universe in the controller.
	for (let i = 1; i <= UNIVERSES; i++) {
		var packet = client.createPacket(510)
		var slotsData = packet.getSlotsData()
		// Color every 3rd pixel
		for (let j = offset; j < 510; j += 3) {
			slotsData[j] = 255
		}
		packet.setUniverse(i)
		// packet.setSourceName("???")
		packet.setOption(packet.Options.PREVIEW, true)
		// packet.setPriority(packet.DEFAULT_PRIORITY)
		client.send(packet)
	}
	offset = (offset + 1) % 3
}

async function main() {
	while (true) {
		await wait()
		await render()
	}
}

main().catch(console.error)
