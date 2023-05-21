const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const Dropbox = require('dropbox').Dropbox;
const chalk = require('chalk');
const youtubedl = require('youtube-dl-exec');
const { exec } = require('child_process');
const { resolve } = require('path');

const botName = 'SkyzeeBOT';
const prefix = ['!', '/', '#'];
const prefixRoot = ['>', '$'];
const SESSION_FOLDER_PATH = './session/';
const currentDate = new Date();

const client = {        
    dropbox: new Dropbox({
        accessToken: "sl.BeNG9yLIZWIvKORK-yg0yBGm6gyq6uztLeNSYVQE-iWpgPLTRo_5yi8dzkKnd-GLo9-SFDMK3Gb20lUahBypayKCnEH3q4DljIAxsMZrRuqUcWM3Jr3OkXoamW9KtU4wE7e0-es"
    }),
    wweb_js: new Client({
        authStrategy: new LocalAuth({
            clientId: 'SKYZEEBOT',
            dataPath: SESSION_FOLDER_PATH
        }),
        puppeteer: {
            executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        }
    }),
};

const SkyzeeBOT = client.wweb_js;

if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log(`${chalk.green('[✓]')} ${chalk.greenBright(`Path '${SESSION_FOLDER_PATH}' found!`)}`);
} else {
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellowBright(`Path '${SESSION_FOLDER_PATH}' not found! Scan the QR...`)}`);
}

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellowBright('Scan me!')}`)
});

SkyzeeBOT.on('authenticated', () => {});

SkyzeeBOT.initialize();
    
SkyzeeBOT.on('ready', () => {
    console.log(`${chalk.green('[✓]')} ${chalk.greenBright(`${botName} succesfully connected to "${SkyzeeBOT.info.pushname}"!`)}`);
});
    
SkyzeeBOT.on('message', async message => {
    console.log(message);

    const isCommand = new RegExp(`^[${prefix.join()}]`).test(message.body);

    if (!isCommand) return;

    const args = message.body.split(' ');
    const command = args.shift().slice(1);
    
    switch (command) {
        case 's': case 'sticker':
            if (!message.hasQuotedMsg && !message.hasMedia) {
                let res = `No se encontró la imagen que deseas convertir! Recuerda que para crear stickers debes enviar ${message.body} adjuntando o respondiendo una imagen o un video de 4 segundos como máximo.`;
                return message.reply(res);
            }
            var media = message.hasQuotedMsg
                ? await message.getQuotedMessage().then(async quoted => await quoted.downloadMedia())
                : await message.downloadMedia();
            var stickerMetadata = {
                sendMediaAsSticker: true,
                stickerAuthor: botName,
                stickerName: `Hecho por ${message._data.notifyName}${message.hasQuotedMsg ? `\nMultimedia de ${message.getQuotedMessage()._data.notifyName}` : undefined}\n\n${currentDate.toLocaleDateString()} (${currentDate.toLocaleTimeString()})`
            };
            message.reply(media, undefined, stickerMetadata);
            break;
        case 'download':
            if (/twitter/.test(args[0])) {
                var buffer = await new Promise((resolve, reject) => {
                    exec(`cd ./utils/twitter-video-dl/ && python twitter-video-dl.py ${args[0]} twitter-${message.from}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        }
                        resolve(`./utils/twitter-video-dl/twitter-${message.from}.mp4`);
                    });
                });
                var media = MessageMedia.fromFilePath(buffer);
                message.reply(media)
                fs.unlink(buffer, (err) => console.error(err));
            } else if (/youtube/.test(args[0]) {
                var buffer = youtubedl(args[0], { dumpSimpleJson: true });
                var media = new MessageMedia(undefined, buffer)
                message.reply(media)
            }
            break;
    };
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(chalk.redBright(`Update ${__filename}`));
	delete require.cache[file];
	require(file);
});