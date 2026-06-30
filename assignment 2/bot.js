require("dotenv").config();

console.log("TOKEN:", process.env.BOT_TOKEN);

const TelegramBot = require("node-telegram-bot-api");
const https = require("https");
const fs = require("fs");

const decodeQR = require("./qr");
const extractRollNumber = require("./parser");
const attendance = require("./attendance");

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);
bot.on("polling_error", (error) => {
    console.error("ERROR NAME:", error.name);
    console.error("ERROR CODE:", error.code);
    console.error("ERROR MESSAGE:", error.message);

    if (error.cause) {
        console.error("CAUSE:", error.cause);
    }
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Send a photo of an IITK ID card."
    );
});

bot.on("photo", async (msg) => {
    try {
        const photo =
            msg.photo[msg.photo.length - 1];

        const file =
            await bot.getFile(photo.file_id);

        const imageURL =
            `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

        const imagePath = "temp.jpg";

        const fileStream =
            fs.createWriteStream(imagePath);

        https.get(imageURL, (response) => {
            response.pipe(fileStream);

            fileStream.on("finish", async () => {
                try {
                    const qrData =
                        await decodeQR(imagePath);

                    const rollNumber =
                        extractRollNumber(qrData);

                    if (
                        rollNumber < 240001 ||
                        rollNumber > 240400
                    ) {
                        bot.sendMessage(
                            msg.chat.id,
                            "Roll number not in registered range."
                        );
                        return;
                    }

                    const added =
                        attendance.markPresent(
                            rollNumber
                        );

                    if (added) {
                        bot.sendMessage(
                            msg.chat.id,
                            `✅ Attendance marked for ${rollNumber}`
                        );
                    } else {
                        bot.sendMessage(
                            msg.chat.id,
                            `⚠️ Roll ${rollNumber} already marked present`
                        );
                    }

                    fs.unlinkSync(imagePath);

                } catch (err) {
                    bot.sendMessage(
                        msg.chat.id,
                        "Could not read QR code."
                    );
                }
            });
        });

    } catch (err) {
        bot.sendMessage(
            msg.chat.id,
            "Error processing image."
        );
    }
});

bot.onText(/\/report/, (msg) => {

    const report =
        attendance.getReport();

    bot.sendMessage(
        msg.chat.id,
        `📊 Attendance Report\n\nPresent: ${report.present}\nAbsent: ${report.absent}`
    );
});

console.log("Bot Running...");
