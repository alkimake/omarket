import blockies from 'ethereum-blockies';

export const blockie = (addr) => {
  return blockies.create({ // All options are optional
    seed: addr, // seed used to generate icon data, default: random
    size: 15, // width/height of the icon in blocks, default: 8
    scale: 3, // width/height of each block in pixels, default: 4
    spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
    // default: random. Set to -1 to disable it. These "spots" create structures
    // that look like eyes, mouths and noses.
  }).toDataURL();
};
