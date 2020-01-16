var req = require('request')

var config = require('../config').config

module.exports.initCommand = function(sender,text,messageChannel,Discord){


        ip = text.split('ip:')[1]
        init_message = ['LOOL','Mawahahahhaahha']
        messageChannel.send(init_message[Math.floor(Math.random() * 2)]+' 😈');
        hack_message = [' Hai Hai senpaaaaaaii !! hackuu timeu',' HACKUU HACKUU',' imuu Supaaa hackaa',' Mewo mewo hacku']
        range_number = Math.floor(Math.random() * 4)
        console.log(range_number)
        random_message = hack_message[range_number]
        messageChannel.send(sender+' '+ random_message);

        messageChannel.send('Scaning '+ip);
        messageChannel.send('Wait');

        
        req('http://'+config.domain_python_server+'/nmap/'+ip,function(error,response,body){
                try{
                    result = JSON.parse(body).scan[ip]['tcp']
                    console.log(result)
                    embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Resultuuuuuuuu')
    
                    for(key in result){
                        embed.addField(key,JSON.stringify(result[key]))
                    }
                    messageChannel.send(embed);
    
                }catch(e){
                    messageChannel.send('Sorry senpaii .. IP ('+ip+') unreachable T_T');
                }

        })
        messageChannel.send(':P');


}