/*
WS2811 LED Mount

Actual Measurements:

Diameter: 0.475 inches
Diameter with ridge clip: 0.5 inches
Thickness of wood: 0.125 inches

*/

// NOTE numbers are in 10ths of inches!

// The size of the whole to fit the LED into. 
InnerDiameter = 5;
InnerRadius = InnerDiameter / 2;

// The width of wood that this is set into.
FixtureThickness = 2.1;


// The width of the lip on the from of the cylinder
FrontLipRadiusSize = 2;
FrontLipRadius = InnerRadius + FrontLipRadiusSize;
FrontLipThickness = 0.5;

// Thickness of the walls
Thickness = 1;

// Depth of the ridge radius
RidgeRadius = 0.25;
// Width of the ridge
RidgeWidth = 0.4;
// How far up the cylinder the ridge is.
RidgeInset = 0;

// The triangle clip at the top
ClipWidth = 0.5;
ClipHeight = 1;

CutoutOffset = 1.5;
CutoutWidth = 2;

$fn = 100;

module thing() {
difference() {
    
    union() {
        translate([0, 0, 0])
        cylinder(h = FrontLipThickness, r1 = FrontLipRadius, r2 = FrontLipRadius, center = false);
    
        translate([0, 0, 0])
        cylinder(h = FixtureThickness + FrontLipThickness, r1 = InnerRadius + Thickness, r2 = InnerRadius + Thickness, center = false);
    
    }
    
    translate([0, 0, 0])
    cylinder(h = 1000, r1 = InnerRadius, r2 = InnerRadius, center = false);
    
}

difference() {
    translate([0, 0, RidgeInset])
    cylinder(h = RidgeWidth, r1 = InnerRadius , r2 = InnerRadius, center = false);
    
  translate([0, 0, RidgeInset])
cylinder(h = 1000, r1 = InnerRadius - RidgeRadius, r2 = InnerRadius - RidgeRadius, center = false);

}



difference() {
    translate([0, 0,  FixtureThickness + FrontLipThickness])
    cylinder(h = ClipHeight, r1 = InnerRadius + Thickness + ClipWidth, r2 = InnerRadius, center = false);
    
  translate([0, 0,  FixtureThickness + FrontLipThickness])
    cylinder(h = ClipHeight, r1 = InnerRadius, r2 = InnerRadius, center = false);

}
}

module twoprong() {
difference() {
    thing();
    
translate([-10, CutoutWidth / 2, CutoutOffset])
        cube([20, 20, 10]);
    
    translate([-10, -20 - CutoutWidth / 2, CutoutOffset])
        cube([20, 20, 10]);
}
}

union() {
    twoprong();
    rotate(90)
    twoprong();
}

    