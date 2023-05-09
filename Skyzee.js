// variables con información de "require()"
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Dropbox } = require('dropbox').Dropbox;

const prefix = /^[!/.]/;

var client = {};

client.dropbox = new Dropbox();

/* esta variable constante es un objeto que contiene las propiedades dadas por la clase constructora "Client()",
asimismo, se solicita que la propiedad "authStrategy" no se le asigne el valor predeterminado por
"Client()", sino que se asignará un objeto de otra clase constructora (LocalAuth()) el cual, del
mismo modo, su variable "dataPath" contendrá el valor indicado */
client.wweb-js = new Client({
    authStrategy: new LocalAuth({
        clientId: 'SKYZEEBOT',
        dataPath: './session'
    })
});

const SkyzeeBOT = client.wweb-js;

SkyzeeBOT.initialize();

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

SkyzeeBOT.on('authenticated', () => {
    console.log('SkyzeeBOT activo');
});

SkyzeeBOT.on('ready', () => {
    SkyzeeBOT.on('message', (msg) => {
        const isCommand = prefix.test(msg);
        const command = isCommand ? msg.slice(1) : null;
        console.log(msg);
        if (!isCommand) return;
        if (msg === '!session.save') {
            fs.write('./session.json', sessionData, () => console.log('SESSION GUARDADA'))
        }
    })
});
