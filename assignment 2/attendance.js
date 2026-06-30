const fs = require("fs");

const FILE = "attendance.json";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(
        FILE,
        JSON.stringify({ present: [] }, null, 2)
    );
}

function loadData() {
    return JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );
}

function saveData(data) {
    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );
}

function markPresent(rollNumber) {
    const data = loadData();

    if (data.present.includes(rollNumber)) {
        return false;
    }

    data.present.push(rollNumber);

    saveData(data);

    return true;
}

function getReport() {
    const data = loadData();

    return {
        present: data.present.length,
        absent: 400 - data.present.length
    };
}

module.exports = {
    markPresent,
    getReport
};