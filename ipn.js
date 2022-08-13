const { Client, LocalAuth } = require('whatsapp-web.js');

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const projectId = 'example-id';
const sessionId = uuid.v4();

const sessionClient = new dialogflow.SessionsClient({
	keyFilename: "example-id-xpck-1022d41d9e18.json"
  });


  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

async function Chatting(inputText) {
const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: inputText,
        // The language used by the client (en-US)
        languageCode: 'id-ID',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  return result.fulfillmentText;

}


const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: { headless: true }

});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    
	//msg.reply( await Chatting(msg.body))
	client.sendMessage(msg.from, await Chatting(msg.body));
});

client.initialize();