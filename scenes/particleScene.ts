import { Scene } from "../types"
import * as config from "../config"
import * as chroma from "chroma-js"

const particles = 20
const size = 1

interface Particle {
	x: number
	y: number
	dx: number
	dy: number
	color: string
}

const makeParticle = () => {
	const particle: Particle = {
		x: Math.round(Math.random() * config.width),
		y: Math.round(Math.random() * config.height),
		dx: Math.random() * 1 * Math.sign(Math.random() - 0.5),
		dy: Math.random() * 2 * Math.sign(Math.random() - 0.5),
		color: chroma.hsl(Math.random() * 360, 1, 0.5).toString(),
	}
	return particle
}

const updateParticle = (particle: Particle) => {
	if (particle.x <= 0 && particle.dx < 0) {
		particle.dx = -particle.dx
	} else if (particle.x >= config.width - size && particle.dx > 0) {
		particle.dx = -particle.dx
	}
	if (particle.y <= 0 && particle.dy < 0) {
		particle.dy = -particle.dy
	} else if (particle.y >= config.height - size && particle.dy > 0) {
		particle.dy = -particle.dy
	}
	particle.x += particle.dx
	particle.y += particle.dy
	return particle
}

const renderParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
	ctx.fillStyle = particle.color
	ctx.fillRect(particle.x, particle.y, size, size)
}

const particleScene: Scene<Array<Particle>> = {
	init: () => {
		return Array(particles)
			.fill(0)
			.map(() => makeParticle())
	},
	update: state => {
		return state.map(updateParticle)
	},
	render: (ctx, state) => {
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, config.width, config.height)
		state.map(particle => renderParticle(ctx, particle))
	},
}

export default particleScene
