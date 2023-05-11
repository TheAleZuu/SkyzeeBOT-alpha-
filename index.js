// variables con información de "require()"
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const JSZip = require('jszip');
const Dropbox = require('dropbox').Dropbox;

const prefix = /^[!/.]/;

async () => {
    const client = await new function () {
        let SESSION_FILE_PATH = '/session/';
        
        async () => {
            this.dropbox = new Dropbox({
                accessToken: "sl.BeL__yWV3JcdCPP2HD8XXT42mBI6UEn8NqQS9fmD4qUpVBB6SFEogHWH7Dam3ZDxSGNRsWeFO0BbPME9X-pNTUXZO_4VyQbQdPCaxRdon4_oNewcWi5kF-B6MVi1TlzkpITAGOY"
            });
        
            if (!fs.existsSync(SESSION_FILE_PATH)) {
                console.log('[!] No se encontró el archivo de sesión, descargando...');
                await this.dropbox.filesDownloadZip({
                    path: '/session/'
                }).then(response => {
                    console.log(response);
                    // Crear un objeto JSZip a partir de los datos del archivo ZIP
                    return JSZip.loadAsync(response.result.fileBinary);
                }).then(zip => {
                    // Descomprimir el archivo ZIP
                    return zip.forEach((relativePath, file) => {
                        // verificar si el archivo es una carpeta
                        if (file.dir) {
                            console.log(`[!] Descargando sesión de WhatsApp...  ${relativePath} (FOLDER)`);
                            let dir = relativePath.replace(/\/$/, '');
                            fs.mkdirSync(dir, (err) => console.error(err));
                        } else {
                            // Si es un archivo, extraer el contenido
                            console.log(`[!] Descargando sesión de WhatsApp...  ${relativePath} (FILE)`);
                            file.async('string').then(content => {
                                let filename = fs.openSync(relativePath, 'w');
                                fs.writeSync(filename, content);
                                fs.closeSync(filename);
                            });
                        };
                    });
                });
            } else {
                console.log('[!] Archivo de sesión encontrada!');
            };
            
            this.wweb_js = new Client({
                authStrategy: new LocalAuth({
                    clientId: 'SKYZEEBOT',
                    dataPath: SESSION_FILE_PATH
                })
            });
        };
    };

    const SkyzeeBOT = client.wweb_js;

    SkyzeeBOT.initialize();

    SkyzeeBOT.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
    });

    SkyzeeBOT.on('authenticated', () => {
        console.log('SkyzeeBOT activo');
    });

    SkyzeeBOT.on('ready', () => {
        SkyzeeBOT.on('message', (wweb_allResult) => {
            const msgConfig = wweb_allResult.Message._data;
            const isCommand = prefix.test(msgContent);
            const command = isCommand ? msg.slice(1) : null;
            console.log(msg);
            if (!isCommand) return;
        })
    });
};