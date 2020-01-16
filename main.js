
var tokens = require('./config').tokens
var apiaiApp = require('apiai')(tokens.ai_api_token);
const Discord = require("discord.js");
agent_ip = '192.168.36.221'

var bot_nmap = require('./commands/bot-nmap-command')
// Initialize Discord Bot
const client = new Discord.Client();
// This is our logger.
const pino = require('pino')({
    prettyPrint: true,
    level: 'trace'
  })


  

  
// @ts-ignore
const speech = require('@google-cloud/speech').v1p1beta1
const speechClient = new speech.SpeechClient({
  keyFilename: 'google-cloud.credentials.json'
})


var isJoined = false;

// Listen to the ready event of the bot
client.on('ready', function (evt) {
    pino.info('Bot Connected')


});

// Check for incomming messages into the channel
client.on('message', message => {

    // Avoid the bot to reply to itself
    if (message.author.bot) return;

    tag = message.content.split(' ')[0].trim().toLowerCase()

    // Check if the message starts with the !
    if (tag === 'gubi' || tag === tokens.bot_id) {
        // Get a substring to exclude the ! from the message
        var text = message.content.replace(tokens.bot_id,'');

        text = text.trim().toLowerCase()
        console.log(text)

        if(text.startsWith('nmap')){
        bot_nmap.initCommand(message.author,text,message.channel,Discord)
        return
        }
        if (text.startsWith('join') || text.startsWith('leave')) {

            const voiceChannel = message.member.voiceChannel;
            const messageChannel = message.channel;


            if (text.startsWith('leave')) {
                messageChannel.send(message.author + ' bye', { tts: true });
                voiceChannel.leave()
                pino.info('Bot Left channel')

                isJoined = false
                return
            }



            if (!voiceChannel) return messageChannel.send(message.author + ' Stupid! Where I can join you ');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return messageChannel.send(message.author + ' Gimme the permissions -.-');
            }
            message.reply('My pleaure');


            
            voiceChannel.join()
                .then(connection => {

                })
                .catch(error => {
                    console.log(error)
                    return messageChannel.send("Oops! There is an error in me" + '... Azozzzzzzzzzzzzzz');

                });

            isJoined = true;
            messageChannel.send(' Hi', { tts: true });
            pino.info('Joined channel!')

            return;


        }

        // Parse the text to the API.ai
        var request = apiaiApp.textRequest(text, {
            sessionId: '<any-unique-name>'
        });

        // Listen to a response from API.ai
        request.on('response', (response) => {
            // Reply the user with the given response
            if(isJoined)
            {
                message.channel.send(response.result.fulfillment.speech, { tts: true });
            } else
            message.reply(response.result.fulfillment.speech);
        });

        // Listen for any errors in the response
        request.on('error', (error) => {
            // Tell the user that an error happened
            message.reply("Oops! There is an error in our end")
        });

        // End the request to avoid wasting memory
        request.end();
    }
});




async function join(voiceChannel, textChannel) {
 pino.trace('Joining voice channel...')
 const voiceConnection = await voiceChannel.join()
 const receiver = voiceConnection.createReceiver()
 pino.info('Voice channel joined.')

 // Every 60 seconds, report API usage and money spent.
 let lastReportedUsage = 0
 setInterval(() => {
   if (totalBilledThisSession === lastReportedUsage) {
     return
   }
   lastReportedUsage = totalBilledThisSession
   const money = (lastReportedUsage / 15 * 0.006).toFixed(3)
   textChannel.send(
     `Google Cloud Speech API usage: ${lastReportedUsage} seconds (\$${money})`
   )
 }, 60000)
}

// Login into the Discord API
client.login(tokens.discord_api_token);