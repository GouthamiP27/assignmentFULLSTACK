function extractRollNumber(qrData) {
    const match = qrData.match(/\b24\d{4}\b/);

    if (!match) {
        throw new Error("Roll number not found");
    }

    return Number(match[0]);
}

module.exports = extractRollNumber;