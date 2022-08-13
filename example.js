const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const projectId = 'main-dialog-ibqu'
const sessionId = uuid.v4();

const sessionClient= new dialogflow.SessionsClient({
    keyFilename: "main-dialog-ibqu-b97f49d8b989.json"
  });
  

    const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );



async function Chatting(inputText ) {
const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // query untuk dikirim ke agen dialogflow
        text: inputText,
        // Bahasa yang digunakan (id-ID)
        languageCode: 'id-ID',
      },
    },
  };

  // Kirim permintaan dan hasil log
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  return result.fulfillmentText;

}

const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: false }

});

client.on('qr', (qr) => {
    // Menghasilkan dan memindai kode ini dengan ponsel Anda
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const prefix = "!";

        client.on('message',async msg => {
          try {
          client.sendMessage(msg.from, await Chatting(msg.bod));
          }
          catch(err) {
            console.log("opsie, " + err.message)
          }

          
          if (msg.body[0] == prefix){
            var [cmd, ...args] = msg.body.slice(1).split(" ");
            args  = args.join(" ");
          }
          if (cmd == "say"){client.sendMessage(msg.from, args);
          }
          
          if (cmd == "gambar"){
                    const media = MessageMedia.fromFilePath('./IMAGES/chika.jpg');
                    client.sendMessage(msg.from, media);
          }
          if (msg.body.startsWith('!menfess ')) {
            //  command chat nomor
            let number = msg.body.split(' ')[1];
            let messageIndex = msg.body.indexOf(number) + number.length;
            let message = msg.body.slice(messageIndex, msg.body.length);
            number = number.includes('@c.us') ? number : `${number}@c.us`;
            let chat = await msg.getChat();
            chat.sendSeen();
            client.sendMessage(number, message);
            client.sendMessage(msg.from, 'pesan berhasil terkirim');
          }
            if (msg.body === '!help') {
              //Kirim pesan baru sebagai balasan untuk yang saat ini
              msg.reply('!say (untuk mengulangi perkataan)')
          }
            if (msg.body === '!help') {
            //Kirim pesan baru sebagai balasan untuk yang saat ini
            msg.reply('!menfess nomor_HP Pesan (!menfess 6289893xxxx aku cinta kamu)_beta testing_')
        }
            if (msg.body === '!help') {
          //Kirim pesan baru sebagai balasan untuk yang saat ini
          msg.reply('!gambar (gambar chika)')
            }
          if (msg.body === '!help') {
            //Kirim pesan baru sebagai balasan untuk yang saat ini
            client.sendMessage(msg.from, 'instagram: https://www.instagram.com/irfann_404/')
          
      }
          
      });
    
//batas suci 


client.initialize();
