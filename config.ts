import { SceneName } from "./scenes/allScenes"

// Dimensions of the test panel.
export const height = 30
export const width = 15 * 28 // 28 boards wide

// Render rate
export const frameRate = 60

// Index starts at 0
export const pixeliteOutputIndex = 0

// Open Advatek Assistant to connect to the controller and set the static IP
export const pixeliteIpAddress = "192.168.1.69"

export const startScene = "walkScene" as SceneName
