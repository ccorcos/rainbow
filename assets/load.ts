import * as gifFrames from "gif-frames"

// loadImage('examples/images/lime-cat.jpg').then((image) => {
// 	ctx.drawImage(image, 50, 0, 70, 70)

export async function loadGif(path: string) {
	if (typeof window === "undefined") {
		const fs = await import("fs-extra")
		const canvas = await import("canvas")
		const gif = await fs.readFile(__dirname + "/" + path)
		const frames: Array<any> = await new Promise<any>(resolve =>
			gifFrames(
				{
					url: gif,
					frames: "all",
					outputType: "png",
				},
				(err, result) => resolve(result)
			)
		)
		for (const frame of frames) {
			frame
				.getImage()
				.pipe(fs.createWriteStream("/tmp/image-" + frame.frameIndex + ".png"))
		}
		// Wait for the write stream
		await new Promise(resolve => setTimeout(resolve, 1000))
		const images = (await Promise.all(
			frames.map(async frame => {
				var img = new canvas.Image()
				img.src = await fs.readFile("/tmp/image-" + frame.frameIndex + ".png")
				return img
			})
		)) as any
		return images as Array<HTMLImageElement>
	} else {
		const frames: Array<any> = await new Promise<any>(resolve =>
			gifFrames(
				{
					url: "/" + path,
					frames: "all",
					outputType: "canvas",
				},
				(err, result) => resolve(result)
			)
		)
		const images = frames.map(frame => frame.getImage())
		return images as Array<HTMLImageElement>
	}
}
