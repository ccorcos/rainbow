const e131 = require("e131")

// Open Advatek Assistant to connect to the controller and set the static IP
const ipAddress = "192.168.1.69"

// universe 10, channel 361
// universe 13, channel 480

var client = new e131.Client(ipAddress) // or use a universe
var packet = client.createPacket(510) // we want 8 RGB (x3) slots
var slotsData = packet.getSlotsData()

packet.setSourceName("PL1")
packet.setUniverse(10)
// packet.setOption(packet.Options.PREVIEW, true) // don't really change any fixture
packet.setPriority(packet.DEFAULT_PRIORITY) // not strictly needed, done automatically

// slotsData is a Buffer view, you can use it directly
var color = 0
function cycleColor() {
	for (var idx = 0; idx < slotsData.length; idx++) {
		slotsData[idx] = color % 0xff
		color = color + 90
	}
	client.send(packet, function() {
		setTimeout(cycleColor, 125)
	})
}
cycleColor()
