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
    console.log(`${chalk.greenBright('[✓]')} ${chalk.green(`Path '${SESSION_FOLDER_PATH}' found!`)}`);
} else {
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow(`Path '${SESSION_FOLDER_PATH}' not found! Scan the QR...`)}`);
}

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow('Scan me!')}`)
});

SkyzeeBOT.on('authenticated', () => {});

SkyzeeBOT.initialize();
    
SkyzeeBOT.on('ready', () => {
    console.log(`${chalk.greenBright('[✓]')} ${chalk.green(`${botName} succesfully connected to "${SkyzeeBOT.info.pushname}"!`)}`);
});
    
SkyzeeBOT.on('message', async message => {
    console.log(message);
    
    const isCommand = new RegExp(`^[${prefix.join()}]`).test(message.body);
    const chatMetadata = await SkyzeeBOT.getChatById(message.from);
    const userMetadata = await message.getContact(message.author);
    
    if (chatMetadata.isGroup) {
        console.log(' < ' + chalk.bgMagenta(' GROUP: ') + chalk.magentaBright.bgMagenta(chatMetadata.name) + ' > ');
        console.log('   ' + chalk.magenta('"' + userMetadata.pushname + '"') + (userMetadata.name !== undefined ? ` (${userMetadata.name})` : '') + ':');
        console.log('       ' + chalk.magentaBright(message.body));
    } else {
        console.log(' < ' + chalk.bgBlue(' PRIVATE: ') + chalk.blueBright.bgBlue(chatMetadata.name) + ' > ');
    }

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
                stickerName: `Hecho por ${(await message.getContact()).pushname}${message.hasQuotedMsg ? `\nMultimedia de ${(await message.getContact()).pushname}` : undefined}\n\n${currentDate.toLocaleDateString()} (${currentDate.toLocaleTimeString()})`
            };
            message.reply(media, undefined, stickerMetadata);
            break;
        case 'download':
            if (args[0].includes('twitter')) {
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
            } else if (args[0].includes('youtube') || args[0].includes('youtu.be')) {
                var path = `./tmp/youtube-${message.from}.mp4`;
                await youtubedl(args[0], {
                    output: path,
                    format: 'mp4'
                });
                var media = MessageMedia.fromFilePath(path);
                message.reply(media);
                fs.unlink(path, (err) => console.error(err));
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