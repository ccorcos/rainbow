# Rainbow Bridge Project

More documentation [here](https://www.notion.so/rainbowbridge/Team-Home-c0645d0a42684d2290b79d886ea4c0c2).

- The WS2811 LED mount is build using OpenSCAD.
- The PIXLITE 16 MKII controller is controlled over sACN protocol

## Getting Started

- Install Node.js, Npm, and Git.

```
git clone git@github.com:ccorcos/rainbow.git
cd rainbow
npm install
brew install cairo
./node_modules/.bin/ts-node runScene.ts --scene=walkScene
```

## Not Working

- Does the Advatek Assistant work?
- Is it setup for e1.31 or artnet?
- Are the outputs mapped to universe 1 channel 1 sequential?

## To Do

- [x] Efficiently draw visualization, for example, using https://github.com/Automattic/node-canvas
- [x] Client / Server abstractions
- [x] Preview on the client, render on the server
	- [x] fix the borderScene
	- [x] bounceScene
	- [] other ideas...
- [] stress test
	- [] full size test.
		28 boards per side with 450 pixels per board. 28 * 450 = 12600
		One pixelite has 16 outputs with 550 pixels per output. 16*550 = 8800
		12600 * 2 / 8800 = 2.86. We can do this with 3 pixelites. 4 would be easier...

		- [] fullsize rainbow. start at output 1. 14 boards for one pixelite.
		-

- [ ] Efficiently generate packets using matrix operations, for example, using https://github.com/tensorflow/tfjs

