const { Client, RichEmbed, Message, MessageEmbed, MessageAttachment, Integration } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
module.exports = {
    modify: function(interaction, args, user) {

        type = ""

        if(args[0].value === "set"){
            type = "set to "
        }
        else if(args[0].value === "add"){
            type = "credited with "
        }
        else if(args[0].value === "remove"){
            type = "debited from "
        }
        var embed = new MessageEmbed()
        .setTitle(':pencil: Currency has been edited : ')
        .setColor(0x2abf39)
        .setDescription('The user '+user+' as been '+type+args[2].value+' :dollar:')
        .setTimestamp()
        .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128");

        //if command was correct
        return embed

    },
    profile: async function(interaction, args, user, currency, boost, role, resp) {

        if(currency[0] == null){
            var dvalue = 0
        }
        else{
            var dvalue = currency[0].amount
        }

        if(boost == "tier1" || boost == "tier2"){

            if(role === "admin"){
                role = "f8bae833e841f69bd5d5bd23568f9a09"
            }
            else if(role === "moderator"){
                role = "ad2e4d6e7b90ca6005a5038e22b099cc"
            }
            else if(role === "user"){
                role = "3547c9b25b1b9a1da8c06100fc4da900"
            }

            async function draw() {

                const width = 600
                const height = 1000

                const canvas = createCanvas(width, height)
                const context = canvas.getContext('2d')

                loadImage('https://media.discordapp.net/attachments/874044700309454858/875858170965274674/profile_canvas.png?width=405&height=676').then(async image => {
                    context.drawImage(image, 0, 0, 600, 1000)

                    const pp = await loadImage('https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.png?size=128')
                        context.drawImage(pp, 25, 25, 215, 215)

                        context.textAlign = 'left'
                        context.textBaseline = 'top'
                        context.fillStyle = '#d6d6d6'
                        context.font = '50px segoe ui bold'
                        context.fillText(user.username, 245, 80)

                        context.font = '40px segoe ui bold'
                        context.fillText(dvalue+' 💵', 360, 510)

                        context.font = '40px segoe ui bold'
                        context.fillText('[WIP]', 24, 700)


                    const image_role = await loadImage('https://discordapp.com/assets/'+role+'.svg')
                    context.drawImage(image_role, 245, 35, 50, 50)

                    const buffer = canvas.toBuffer('image/png')

                    const attachment = new MessageAttachment(buffer, 'profile-image.png');
                    resp.send(attachment)
                })
            }

            const embed = await draw();
            return embed
        }

        var embed2 = new MessageEmbed()
        .setTitle(':desktop: '+user.username+'\'s Profile : ')
        .setColor(0xda5d5d)
        .setDescription('User ID : '+user.id)
        .setTimestamp()
        .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
        .setThumbnail('https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.webp?size=128')
        .addFields({ name: 'Server Currency : '+dvalue+' :dollar:', value: "------"});
    
        //if command was correct
        return embed2

    },
    leaderboard: function(interaction, args, leaderboard, guild) {

        var embed = new MessageEmbed()
        .setTitle(':trophy: Server Leaderboard')
        .setColor(0xda5d5d)
        .setDescription('Server : '+guild.name)
        .setTimestamp()
        .setAuthor("proxyfil", "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
        .setThumbnail('https://cdn.discordapp.com/icons/'+guild.id+'/'+guild.icon+'.webp?size=128')
                    
                    const list = Object.entries(leaderboard)

                    field = ""
                    if(list[0] != null){
                        i = 0
                    }
                    else{
                        i = 15
                        field = "No users have been register yet"
                        embed.addField(field,"---------")
                    }
                    while (i != 15){
                        if(list[i] != null){
                            field = ((i+1) + "- User ID : " + list[i][0] + " | " + list[i][1] + " :dollar: \n")
                            embed.addField(field,"---------")
                        }
                        i = i + 1
                    }
        //if command was correct
        return embed

    }
}