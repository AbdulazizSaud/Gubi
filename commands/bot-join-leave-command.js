var req = require('request')

var config = require('../config').config

module.exports.initCommand = function (text,message) {
    const author = message.author
    const voiceChannel = message.member.voiceChannel;
    const messageChannel = message.channel;

    if (text.startsWith('join') || text.startsWith('leave')) {

        if (text.startsWith('leave')) {
            messageChannel.send(message.author + ' bye', { tts: true });
            voiceChannel.leave()

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
    }
}