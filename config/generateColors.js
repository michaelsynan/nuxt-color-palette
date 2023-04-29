// generateColors.js
import chroma from 'chroma-js';

const namingConvention = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function randomHexColor(minBrightness = 32, maxBrightness = 223) {
  let color;
  do {
    const randomColorValue = () => {
      const min = Math.ceil(0);
      const max = Math.floor(255);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const r = randomColorValue();
    const g = randomColorValue();
    const b = randomColorValue();

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness >= minBrightness && brightness <= maxBrightness) {
      color = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    }
  } while (!color);

  return color;
}

function generateShades(color, numShades) {
  const shades = [];
  const increment = 1 / numShades;

  for (let i = 1; i <= numShades; i++) {
    const light = chroma(color).brighten(i * increment).hex();
    const dark = chroma(color).darken(i * increment).hex();
    shades.push({ light, dark });
  }

  return shades;
}

export function generateBaseColors(colorScheme, numBaseColors, initialColor) {
  const baseColor = initialColor || randomHexColor();
  const baseColors = [baseColor];

  const scale = chroma.scale([baseColor]).mode('hsl');
  const angle = 360 / numBaseColors;

  switch (colorScheme) {
    case 'triadic':
    case 'analogous':
    case 'square':
    case 'tetradic':
      for (let i = 1; i < numBaseColors; i++) {
        baseColors.push(chroma(baseColor).set('hsl.h', `+${angle * i}`).hex());
      }
      break;
    case 'complementary':
    case 'splitComplementary':
      for (let i = 1; i < numBaseColors; i++) {
        const complementaryAngle = (360 / (numBaseColors - 1)) * i;
        baseColors.push(chroma(baseColor).set('hsl.h', `+${complementaryAngle}`).hex());
      }
      break;
    // Add other color schemes here
    default:
      console.log(`Color scheme ${colorScheme} not supported. Using the default 'triadic' scheme.`);
      for (let i = 1; i < numBaseColors; i++) {
        baseColors.push(chroma(baseColor).set('hsl.h', `+${angle * i}`).hex());
      }
      break;
  }

  return baseColors;
}

export function generateColors(numBaseColors, numShades, colorScheme, baseColors) {
const colorShades = baseColors.map(color => generateShades(color, numShades));
  const orderedTokens = baseColors.reduce((tokens, color, index) => {
    const prefix = index === 0 ? 'primary' :
                   index === 1 ? 'secondary' :
                   index === 2 ? 'tertiary' : `color${index + 1}`;

    colorShades[index].forEach((shades, shadeIndex) => {
      if (shadeIndex < numShades) {
        tokens[`${prefix}-${namingConvention[5 - (shadeIndex + 1)]}`] = shades.light;
      }
      tokens[`${prefix}-${namingConvention[5]}`] = color;
      tokens[`${prefix}-${namingConvention[shadeIndex + 6]}`] =
      shades.dark;
    });

    return tokens;
  }, {});

  const orderedOutput = Object.entries(orderedTokens).sort((a, b) => {
    const prefixOrder = ['primary', 'secondary', 'tertiary', 'color4', 'color5'];
    const aPrefix = a[0].split('-')[0];
    const bPrefix = b[0].split('-')[0];
    const aNum = parseInt(a[0].split('-')[1]);
    const bNum = parseInt(b[0].split('-')[1]);
    if (aPrefix === bPrefix) {
      return aNum - bNum;
    } else {
      return prefixOrder.indexOf(aPrefix) - prefixOrder.indexOf(bPrefix);
    }
  }).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return orderedOutput;
}
