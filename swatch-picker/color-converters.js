const oklchToOklab = (oklch) => {
    const [ lightness, chroma, hue, alpha = 1 ] = oklch;
    const hueRad = (hue * Math.PI) / 180; // Convert degrees to radians
    const a = chroma * Math.cos(hueRad);
    const b = chroma * Math.sin(hueRad);
    return { lightness, a, b, alpha };
}

const oklabToXyzD65 = (oklab) => {
    const { lightness, a, b, alpha } = oklab;

    // Calculate LMS values
    let l = lightness * 1.0 + a * 0.3963377773761749 + b * 0.2158037573099136;
    let m = lightness * 1.0 + a * -0.1055613458156586 + b * -0.0638541728258133;
    let s = lightness * 1.0 + a * -0.0894841775298119 + b * -1.2914855480194092;

    // Apply the power of 3 to LMS values
    l = Math.pow(l, 3);
    m = Math.pow(m, 3);
    s = Math.pow(s, 3);

    // Convert LMS to XYZ
    const x = l * 1.2268798758459243 + m * -0.5578149944602171 + s * 0.2813910456659647;
    const y = l * -0.0405757452148008 + m * 1.112286803280317 + s * -0.0717110580655164;
    const z = l * -0.0763729366746601 + m * -0.4214933324022432 + s * 1.5869240198367816;

    // Return the XYZD65 object
    return {
        x: x * 100.0,
        y: y * 100.0,
        z: z * 100.0,
        alpha: alpha
    };
}

const xyzD65ToLinearRgb = (xyzD65) => {
    const { x, y, z, alpha } = xyzD65;

    // Normalize x, y, z by dividing by 100
    const xNorm = x / 100.0;
    const yNorm = y / 100.0;
    const zNorm = z / 100.0;

    // Calculate red, green, and blue components
    const red = xNorm * (12831.0 / 3959.0) + yNorm * (-329.0 / 214.0) + zNorm * (-1974.0 / 3959.0);
    const green = xNorm * (-851781.0 / 878810.0) + yNorm * (1648619.0 / 878810.0) + zNorm * (36519.0 / 878810.0);
    const blue = xNorm * (705.0 / 12673.0) + yNorm * (-2585.0 / 12673.0) + zNorm * (705.0 / 667.0);

    // Return the LinearRgb object
    return {
        red,
        green,
        blue,
        alpha
    };
}

const linearRgbToSrgb = (linearRgb) => {
    const { red, green, blue, alpha } = linearRgb;

    // Helper function to clamp values between 0 and 1
    const clamp01 = (value) => Math.max(0, Math.min(1, value));

    // Helper function for gamma correction
    const gamma = (value) => {
        return value <= 0.0031308
            ? 12.92 * value
            : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    };

    // Convert LinearRgb to Srgb
    return {
        red: Math.round(gamma(clamp01(red)) * 255),
        green: Math.round(gamma(clamp01(green)) * 255),
        blue: Math.round(gamma(clamp01(blue)) * 255),
        alpha
    };
}

export const oklchToHex = (oklch) => {
    
    const oklchOb = oklch.match(/oklch\(([^)]+)\)/)[1].replaceAll(' ', ',').split(',').map(Number);

    const oklab = oklchToOklab(oklchOb);

    const xyzD65 = oklabToXyzD65(oklab);

    const linearRgb = xyzD65ToLinearRgb(xyzD65);

    const srgb = linearRgbToSrgb(linearRgb);

    const r = Math.round(srgb.red);
    const g = Math.round(srgb.green);
    const b = Math.round(srgb.blue);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const oklchToRgb = (oklch) => {
    const oklchOb = oklch.match(/oklch\(([^)]+)\)/)[1].replaceAll(' ', ',').split(',').map(Number);
    const oklab = oklchToOklab(oklchOb);
    const xyzD65 = oklabToXyzD65(oklab);
    const linearRgb = xyzD65ToLinearRgb(xyzD65);
    const srgb = linearRgbToSrgb(linearRgb);

    const r = Math.round(srgb.red);
    const g = Math.round(srgb.green);
    const b = Math.round(srgb.blue);
    return `rgb(${r}, ${g}, ${b})`;
}
