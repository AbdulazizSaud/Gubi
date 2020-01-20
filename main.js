
var tokens = require('./config').tokens
var apiaiApp = require('apiai')(tokens.ai_api_token);
const Discord = require("discord.js");
const _request_ = require('request')
const utf8 = require('utf8')
var bot_nmap = require('./commands/bot-nmap-command')
// Initialize Discord Bot
const client = new Discord.Client();
// This is our logger.
const pino = require('pino')({
    prettyPrint: true,
    level: 'trace'
  })




const langDetectLib = require('languagedetect')
const langDetect = new langDetectLib()

  
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
        var text = message.content.replace(tokens.bot_id,'').trim();

        if(text.startsWith('nmap')){
            bot_nmap.initCommand(message.author,text,message.channel,Discord)
            return
            }

            
        englishRgex = /^[A-Za-z0-9]*$/
        isEnglish  = englishRgex.test(text)
        console.log(isEnglish)

        if(!isEnglish){
            var encode_text = encodeURI(text)
            var url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${tokens.yandex_api}&text=${encode_text}&lang=ar-en`

            _request_(url,(err,response,body)=> {
                if(err){
                    return console.log(err)
                } else{
                    bodyJson = JSON.parse(body)
                    if(bodyJson.code == 200){
                       text = bodyJson.text[0] 
                       responseBot(message,text)
                    }
                }
            })
            
            return
        } else 
        text = text.trim().toLowerCase()

        




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
                    console.log('test')
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

        responseBot(message,text)

    }
});



client.on('presenceUpdate',async(oldPer,newPer) =>{

    const membere = newPer.member
    const memberVoiceChannels = member.voice.channel

    if(!newPer || newPer.activity || !newPer.activity.name || !memberVoiceChannels)
        return

    connection = await memberVoiceChannels.join()   
    
    connection.on('speaking', (user, speaking)=>{
        if(speaking)
        console.log(`i'm listeining to ${user.username}`)
    })

});



function responseBot(message,text) {
    
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

function getHighestPersentage(arrayLangs){
    highest = arrayLangs[0]
    console.log(arrayLangs)

    arrayLangs.forEach(element => {
        if(element[1] > highest[1])
        highest = element
    });

    console.log(highest)

}


// Login into the Discord API
client.login(tokens.discord_api_token);