const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const JSZip = require('jszip');
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

try {
    SkyzeeBOT.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
    });
    
    SkyzeeBOT.on('authenticated', () => {
        console.log('SkyzeeBOT activo');
    });
    
    SkyzeeBOT.on('ready', () => {
        SkyzeeBOT.on('message', async function (wweb_allResult) {
            const msg = {
                id: wweb_allResult._data.id.id,
                body: wweb_allResult._data.body,
                type: wweb_allResult._data.type,
                from: wweb_allResult._data.from,
                author: wweb_allResult._data.author,
                name: wweb_allResult._data.notifyName,
                device: wweb_allResult._data.deviceType,
                links: wweb_allResult._data.links,
                mentions: wweb_allResult._data.mentionedJidList,
                quoted: wweb_allResult._data.quotedMsg,
                isForwarded: wweb_allResult._data.isForwarded,
                isStatus: wweb_allResult._data.isStatus,
                isBroadcast: wweb_allResult._data.broadcast,
                isFromMe: wweb_allResult._data.fromMe
            }


            // const isCommand = prefix.test(msgContent);
            // const command = msg.slice(1);
            console.log(wweb_allResult);
            // if (!isCommand) return;
        });
    });
} catch (err) {
    console.log(err);
};
    
SkyzeeBOT.initialize();

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})