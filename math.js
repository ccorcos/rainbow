height = 31
width = 73
thickness = 6 + 5 / 12

// Meghan's math.
outerRadiusMinusHeight = 371.25 / 62
outerRadius = height + outerRadiusMinusHeight
innerRadius = outerRadius - thickness

// LED Arc length
arcRadians = Math.acos(outerRadiusMinusHeight / innerRadius) * 2
arcDegress = arcRadians * 180 / Math.PI

numberOfSection = 7
arcRadiansPerSection = arcRadians / numberOfSection

// using 4' x 8' sheets.

innerArcLength = arcRadiansPerSection * innerRadius
outerArcLength = arcRadiansPerSection * outerRadius

panelsPerSection = 4
innerPanelLength = innerArcLength / panelsPerSection
outerPanelLength = outerArcLength / panelsPerSection
