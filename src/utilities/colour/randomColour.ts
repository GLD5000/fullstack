import getRandomNumberBetween from "../number/randomNumber";
import { setToTargetLuminanceHsl } from "./autoContrast";
import { colourSpace } from "./colourSpace";

export const randomColour = {
  randomIntegerInRange(start: number, end: number): number {
    return start + Math.floor(Math.random() * (end - start));
  },
  makeRandomHsl(): Array<number> {
    const hue = Math.floor(Math.random() * 360);
    const sat = 48 + Math.floor(Math.random() * 40); // 48 - 87
    const lum = 63 + Math.floor(Math.random() * 25); // 63 - 88
    return [hue, sat, lum];
  },
  makeRandomHslSafer(): Array<number> {
    const hue = randomColour.randomIntegerInRange(0, 360);
    const sat = randomColour.randomIntegerInRange(60, 90);
    const lum = randomColour.randomIntegerInRange(70, 90);
    return [hue, sat, lum];
  },
  makeRandomHslString() {
    const [hue, sat, lum] = randomColour.makeRandomHslSafer();
    return `HSL(${hue}, ${sat}%, ${lum}%)`;
  },
  makeRandomHex() {
    const randomHsl = randomColour.makeRandomHslSafer();
    const randomHex = colourSpace.convertHslArrayToHex(randomHsl);
    return randomHex;
  },
};
export default function getRandomColour(type?:string) {
  if (!!!type) {
    const randomHex = randomColour.makeRandomHex();
    return randomHex;
  }
  const luminanceLookup: {[key:string]: number[]} = {
    'mid': [17.6, 18.1],
    'light': [30.1, 50.2],
    'dark': [4.7, 9.9] 
  }
  const randomHslArray = randomColour.makeRandomHslSafer();
  console.log('randomHslArray:', randomHslArray);
  const luminance = getRandomNumberBetween(luminanceLookup[type]||[17.6, 18.1],2)
  console.log('luminance:', luminance);
  const constrainedHslArray = setToTargetLuminanceHsl(randomHslArray,luminance);
  console.log('constrainedHslArray:', constrainedHslArray);
  return colourSpace.convertHslArrayToHex(constrainedHslArray.resultingHsl);
}
