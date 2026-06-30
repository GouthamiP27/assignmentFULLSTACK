const { Jimp } = require("jimp");
const jsQR = require("jsqr");

async function decodeQR(imagePath) {
    const image = await Jimp.read(imagePath);

    const code = jsQR(
        image.bitmap.data,
        image.bitmap.width,
        image.bitmap.height
    );

    if (!code) {
        throw new Error("QR code not found");
    }

    return code.data;
}

module.exports = decodeQR;