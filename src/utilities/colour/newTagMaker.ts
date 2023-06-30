import getRandomColour from "./randomColour";
import AutoTextColour from "./autoTextColour";

export default function makeNewTag(tagName: string) {
  // mid colour lum 17.6 - 18.1%
  const backgroundColour = getRandomColour('mid');
  console.log('backgroundColour:', backgroundColour);
  const newTag = {
    name: tagName.trim(),
    backgroundColour,
  };

  return newTag;
}
