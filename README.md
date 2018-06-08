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
./node_modules/.bin/ts-node test.ts
```

## Not Working

- Does the Advatek Assistant work?
- Is it setup for e1.31 or artnet?
- Are the outputs mapped to universe 1 channel 1 sequential?

## To Do

- [x] Efficiently draw visualization, for example, using https://github.com/Automattic/node-canvas
- [ ] Client / Server abstractions
- [ ] Preview on the client, render on the server
- [ ] Draw visualizations on in the browser while also rendering on the client
- [ ] Efficiently generate packets using matrix operations, for example, using https://github.com/tensorflow/tfjs

