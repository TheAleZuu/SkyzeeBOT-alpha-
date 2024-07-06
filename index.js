require('./global.js');
const cliProgress = require('cli-progress');
const SkyzeeBOT = require('./Skyzee.js');
const { a } = require('./donut-js/donut.min.js');

var seguir = true;

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

function centerText(text) {
    const paddingLength = Math.floor((process.stdout.columns - text.length) / 2);
    const padding = ' '.repeat(paddingLength);
    
    return (padding + text);
}

async function girarDonut(ms) {
    while (seguir) {
        process.stdout.write('\x1b[J\x1b[H' + a());
        process.stdout.write(centerText(`${chalk.greenBright('[✓]')} ${chalk.green(`Path '${SESSION_FOLDER_PATH}' found!`)}`))
        await new Promise(async resolve => setTimeout(resolve, ms));
    }
}

if (fs.existsSync(SESSION_FOLDER_PATH)) {
    girarDonut(50);
    // console.log(`\n              ${chalk.greenBright('[✓]')} ${chalk.green(`Path '${SESSION_FOLDER_PATH}' found!`)}`);
} else {
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow(`Path '${SESSION_FOLDER_PATH}' not found! Scan the QR...`)}`);
}



Skyzee.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log(`${chalk.rgb(255, 200, 0)('[!]')} ${chalk.yellow('Scan me!')}`);
});

// Skyzee.on('authenticated', async (session) => {
// })

Skyzee.on('ready', async () => {
    seguir = false;
    // console.log(`${chalk.greenBright('[✓]')} ${chalk.green(`${botName} succesfully connected to "${Skyzee.info.pushname}"!`)}`);
    for (let i = 0; i < 3; i++) {
        process.stdout.cursorTo(0);
        process.stdout.clearLine();
        await new Promise(resolve => setTimeout(resolve, 300));
        process.stdout.write(`${chalk.greenBright('[✓]')} ${chalk.green(`${botName} succesfully connected to "${Skyzee.info.pushname}"!`)}`);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    process.stdout.write('/n');
    let i = 0;
    setInterval(() => {
        new cliProgress.SingleBar({
            format: "{bar}",
            barsize: 3,
            barCompleteChar: barChar[i++],
            align: "right"
        }, cliProgress.Presets.shades_classic).start(1, 1);
        if (i >= 4) {
            i = 0;
        }
    }, 1000);
    // process.stdin.read();
    // setInterval(async () => {
    //     let chats = Skyzee.getChats();
    //     let randomJPG = Math.floor(Math.random() * 91) + 1;
    //     let randomMP4 = Math.floor(Math.random() * 171) + 1;
    //     let path = (Math.floor(Math.random() * 1) + 1 == 1) ? `./media/momazos.com/meme (${randomJPG}).jpg` : `./media/momazos.com/meme (${randomMP4}).mp4`;
    //     for (let i of chats) {
    //         if (!i.isGroup) continue;
    //         let media = await MessageMedia.fromFilePath(path);
    //         Skyzee.sendMessage(i.id._serialized, undefined, { media: media });
    //     };
    // }, 1800000);
});

Skyzee.on('message_create', async (message) => {
    if (!global.public) {
        if (message.author != '5492996557871@c.us') return;
    };
    // console.log(message);
    await SkyzeeBOT(Skyzee, message);
});

Skyzee.on('disconnected', (reason) => {
    console.log(reason);
    Skyzee.initialize();
});

Skyzee.initialize();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(chalk.redBright(`Update ${__filename}`));
	delete require.cache[file];
	require(file);
});