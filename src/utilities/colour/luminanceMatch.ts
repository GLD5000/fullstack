import { luminance } from "./luminance";
import { colourSpace } from "./colourSpace";
/** Expects an HSL numeric array and Relative Luminance expressed as a decimal (0-1 inclusive) */
export default function luminanceMatcherHsl(
  originalHsl: number[],
  targetRl: number
) {
  const originalRl = luminance.convertHslToLuminance(originalHsl);
  // console.log("originalRl:", originalRl);
  const isOriginalDirectionUp = getDirectionFromLuminances(
    originalRl,
    targetRl
  );
  const { maxLum, minLum } = getMinMaxLum(isOriginalDirectionUp, originalHsl);
  const [hue, sat] = originalHsl;
  let currentLum = getInitialLum(targetRl);
  // console.log('currentLum after greyscale:', currentLum);
  let currentRl = getInitialRl(hue, sat, currentLum);
  let isMatch = currentRl === targetRl;
  let isCurrentDirectionUp = getDirectionFromLuminances(currentRl, targetRl);
  const startIncrement = 10;
  let overshoots = 0;
  // loop start
  // console.log('currentRl:', currentRl);
  // console.log('isCurrentDirectionUp:', isCurrentDirectionUp);
  // const lumLogger = [];
  // const incrementLogger = [];
  const base = 2.775;
  const loopLimit = 24;
  for (let i = 0; i < loopLimit; i += 1) {
    const multiplier = 1 / Math.max(1, base ** overshoots);
    const increment = calcIncrement(
      isCurrentDirectionUp,
      startIncrement,
      multiplier
    );
    // incrementLogger.push(increment);
    currentLum = getIncrementedLum(currentLum, maxLum, minLum, increment); // increment / decrement
    currentRl = luminance.convertHslToLuminance([hue, sat, currentLum]); // check Relative luminance
    // lumLogger.push(currentRl);
    isMatch = checkForMatch(targetRl, currentRl); // check for a relative luminance match
    if (isMatch) {
      // console.log("Loops: ",i);
      break;
    }
    if (!isMatch) {
      const inWrongDirection = isCurrentDirectionUp !== currentRl < targetRl;
      if (inWrongDirection) {
        overshoots += 1;
        isCurrentDirectionUp = !isCurrentDirectionUp;
      }
    }
  }
  // console.log('base:', base);
  // console.log("loopCounter:", loopCounter);
  // if (!isMatch) {
  // console.log('base:', base);
  // console.log('overshoots:', overshoots);
  // console.log('currentRl:', currentRl);
  // console.log('originalHsl:',   originalHsl);
  // console.log('targetRl:',   targetRl);
  // console.log('Difference:',targetRl- currentRl);
  // console.log('lumLogger:', lumLogger);
  // console.log('incrementLogger:', incrementLogger);
  // }
  // loop end
  const returnObject = {
    hslArray: [hue, sat, currentLum],
    currentRl,
  };
  return returnObject;
}

function checkForMatch(targetRl: number, currentRl: number) {
  const rlDifference = targetRl - currentRl;
  return rlDifference > -0.000001 && rlDifference < 0.000001; // check for a relative luminance match
}

function getIncrementedLum(
  currentLum: number,
  maxLum: number,
  minLum: number,
  increment: number
) {
  return Math.min(maxLum, Math.max(minLum, currentLum + increment)); // increment / decrement
}

function calcIncrement(
  isCurrentDirectionUp: boolean,
  startIncrement: number,
  multiplier: number
) {
  return isCurrentDirectionUp
    ? startIncrement * multiplier
    : startIncrement * multiplier * -1;
}

function getInitialRl(hue: number, sat: number, currentLum: number) {
  return luminance.convertHslToLuminance([hue, sat, currentLum]);
}

function getInitialLum(targetRl: number) {
  return colourSpace.convertSrgbToHslArray(
    luminance.convertLumToSrgbGreyscale(targetRl)
  )[2];
}

function getMinMaxLum(isOriginalDirectionUp: boolean, originalHsl: number[]) {
  const maxLum = isOriginalDirectionUp ? 100 : originalHsl[2];
  const minLum = isOriginalDirectionUp ? originalHsl[2] : 0;
  return { maxLum, minLum };
}

function getDirectionFromLuminances(
  startLuminance: number,
  endLuminance: number
) {
  return startLuminance < endLuminance;
}
