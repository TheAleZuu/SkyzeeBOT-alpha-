require('./global.js');

// const dropbox = new Dropbox({
//     accessToken: "sl.BeNG9yLIZWIvKORK-yg0yBGm6gyq6uztLeNSYVQE-iWpgPLTRo_5yi8dzkKnd-GLo9-SFDMK3Gb20lUahBypayKCnEH3q4DljIAxsMZrRuqUcWM3Jr3OkXoamW9KtU4wE7e0-es"
// });
const Skyzee = new wwebjs.Client({
    authStrategy: new wwebjs.LocalAuth({
        clientId: 'SKYZEEBOT',
        dataPath: SESSION_FOLDER_PATH
    }),
    puppeteer: {
        executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    }
});

if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log(`${chalk.greenBright('[✓]')} ${chalk.green(`Path '${SESSION_FOLDER_PATH}' found!`)}`);
} else {
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow(`Path '${SESSION_FOLDER_PATH}' not found! Scan the QR...`)}`);
};

Skyzee.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow('Scan me!')}`);
});

Skyzee.on('ready', () => {
    console.log(`${chalk.greenBright('[✓]')} ${chalk.green(`${botName} succesfully connected to "${Skyzee.info.pushname}"!`)}`);
    setInterval(async () => {
        let chats = Skyzee.getChats();
        let randomJPG = Math.floor(Math.random() * 91) + 1;
        let randomMP4 = Math.floor(Math.random() * 171) + 1;
        let path = (Math.floor(Math.random() * 1) + 1 == 1) ? `./media/momazos.com/meme (${randomJPG}).jpg` : `./media/momazos.com/meme (${randomMP4}).mp4`;
        for (let i of chats) {
            if (!i.isGroup) continue;
            let media = await MessageMedia.fromFilePath(path);
            Skyzee.sendMessage(i.id._serialized, undefined, { media: media });
        };
    }, 1800000);
});

Skyzee.on('message_create', async message => {
    if (!global.public) {
        if (message.author != '5492996557871@c.us') return;
    };
    console.log(message);
    require('./Skyzee.js')(Skyzee, message);
});

Skyzee.initialize();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(chalk.redBright(`Update ${__filename}`));
	delete require.cache[file];
	require(file);
});