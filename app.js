
const config = require('./config')
const apiaiApp = require('apiai')(config.tokens.ai_api_token);
const Discord = require("discord.js");
const _request_ = require('request')
const bot_id  =config.config.bot_id
const bot_nmap = require('./commands/bot-nmap-command')
const bot_join_leave = require('./commands/bot-join-leave-command')
const pino = require('pino')({
    prettyPrint: true,
    level: 'trace'
})

const client = new Discord.Client();



// Initlizie Youtube API
const queue = new Map()



var isJoined = false;

// Listen to the ready event of the bot
client.on('ready', function (evt) {
    pino.info('Bot Connected')
});

// Check for incomming messages into the channel
client.on('message', message => {

    // Avoid the bot to reply to itself
    if (message.author.bot) return;



    const author = message.author
    const voiceChannel = message.member.voiceChannel;
    const messageChannel = message.channel;

    const prefix = message.content.split(' ')[0].trim().toLowerCase()

    // Check if the message starts with the !
    if (prefix === 'gubi' || prefix === bot_id) {
        // Get a substring to exclude the ! from the message
        var text = message.content.replace(bot_id, '').trim();

        bot_nmap.initCommand(text,message, Discord)
        bot_join_leave.initCommand(text,message)

        if(text.startsWith('play') || text.startsWith('stop')){

            if(text.startsWith('play')){


            } else {

            }

         }


         if(text in config.commands)
             return
         


        englishRgex = /^[A-Za-z0-9]*$/
        isEnglish = englishRgex.test(text)

        if (!isEnglish) {
            var encode_text = encodeURI(text)
            var url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${config.tokens.yandex_api}&text=${encode_text}&lang=ar-en`

            _request_(url, (err, response, body) => {
                if (err) {
                    return console.log(err)
                } else {
                    bodyJson = JSON.parse(body)
                    if (bodyJson.code == 200) {
                        text = bodyJson.text[0]
                        responseBot(message, text)
                    }
                }
            })

            return
        } else
            {text = text.trim().toLowerCase()}


        responseBot(message, text)

    }
});



function responseBot(message, text) {

    // Parse the text to the API.ai
    var request = apiaiApp.textRequest(text, {
        sessionId: '<any-unique-name>'
    });


    // Listen to a response from API.ai
    request.on('response', (response) => {
        // Reply the user with the given response
        if (isJoined) {
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


// Login into the Discord API
client.login(config.tokens.discord_api_token);