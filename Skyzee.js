require('./global.js');
const { exec } = require('child_process');
const { readFile } = require('fs');
const { resolve } = require('path');
// const { MessageMedia } = require('whatsapp-web.js/index');

module.exports = SkyzeeBOT = async (Skyzee, message) => {
    const isCommand = new RegExp(`^[${prefix.join()}]`).test(message.body);
    const chatMetadata = await Skyzee.getChatById(message.from);
    const userMetadata = await message.getContact(message.author);
    
    if (chatMetadata.isGroup) {
        console.log(' < ' + chalk.bgMagenta(' GROUP: ') + chalk.magentaBright.bgMagenta(chatMetadata.name) + ' > ');
        console.log('   ' + chalk.magenta('"' + userMetadata.pushname + '"') + (userMetadata.name !== undefined ? ` (${userMetadata.name})` : '') + ':');
        console.log('       ' + chalk.magentaBright(message.body));
    } else {
        console.log(' < ' + chalk.bgBlue(' PRIVATE: ') + chalk.blueBright.bgBlue(chatMetadata.name) + ' > ');
    }

    const args = message.body.split(' ');

    if (args.includes('@everyone') && message.from != '5492996557871@c.us') {
        let group = await message.getChat();
        let groupParticipants = [];
        for (let i of group.participants) {
            groupParticipants.push(i.id._serialized);
        };
        Skyzee.sendMessage(message.from, message.body, { mentions: groupParticipants });
    };

    if (!isCommand) return;
    const command = args[0].slice(1);

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
                stickerName: `Hecho por ${userMetadata.notifyName}${message.hasQuotedMsg ? `\nMultimedia de ${await message.getQuotedMessage().then(async q => await q.getContact()).pushname}` : ''}\n\n${currentDate.toLocaleDateString()} (${currentDate.toLocaleTimeString()})`
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
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(chalk.redBright(`Update ${__filename}`));
	delete require.cache[file];
	require(file);
});