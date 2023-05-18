const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const Dropbox = require('dropbox').Dropbox;
const chalk = require('chalk');

const SESSION_FOLDER_PATH = './session/'

const prefix = /^[!/.]/;

const client = {        
    dropbox: new Dropbox({
        accessToken: "sl.BeNG9yLIZWIvKORK-yg0yBGm6gyq6uztLeNSYVQE-iWpgPLTRo_5yi8dzkKnd-GLo9-SFDMK3Gb20lUahBypayKCnEH3q4DljIAxsMZrRuqUcWM3Jr3OkXoamW9KtU4wE7e0-es"
    }),
    wweb_js: new Client({
        authStrategy: new LocalAuth({
            clientId: 'SKYZEEBOT',
            dataPath: SESSION_FOLDER_PATH
        })
    })
};

const SkyzeeBOT = client.wweb_js;

if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log('[✓] Archivo de sesión encontrada!');
} else {
    console.log('[!] No se encontró el archivo de sesión!');
};

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

SkyzeeBOT.on('authenticated', () => {
    console.log('SkyzeeBOT activo');
});

SkyzeeBOT.on('ready', () => {
    console.log('SkyzeeBOT activo');
});

SkyzeeBOT.initialize();

SkyzeeBOT.on('message', async message => {
    const command = prefix.test(message.body) ? message.body.slice(1) : null;
    console.log(message);

    switch (command) {
        case 's': case 'sticker':
            await message.reply('media');
            // media = await message.downloadMedia();
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