const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = {
    poll: function(interaction, args) {
    var embed = new MessageEmbed()
    .setTitle(':page_facing_up: New Poll : '+args[1].value)
    .setColor(0xda5d5d)
    .setDescription('The answers :')
    .setTimestamp()
    .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128");
    
    if(args[0].value === 'bet'){  
        embed.setThumbnail('https://media.discordapp.net/attachments/751899176262172762/857608893576642580/bet.png');
    }
    else if(args[0].value === 'poll'){  
        embed.setThumbnail('https://media.discordapp.net/attachments/751899176262172762/857608895383994408/poll.png');
    }
    else if(args[0].value === 'reward'){  
        embed.setThumbnail('https://media.discordapp.net/attachments/751899176262172762/857608897031831562/reward.png');
    }

    var emotes = [':one:',':two:',':three:',':four:',':five:',':six:']
    var emote = 0
    var answers = ""
    args.forEach(arg => {
        if (arg.name.search("choice") != -1){
            answers = answers + emotes[emote]+" = "+arg.value+"\n"
            emote += 1;
        } 
    });
    embed.addFields({ name: answers, value: "------"})


    //if command was correct
    return embed

},

    confirm: function(interaction,choice,new_amount) {
        nbr_choice = 1
        turn = 1
        temp = ["choicea","choiceb","choicec","choiced","choicee","choicef"]
        temp.forEach(element => {
            if(element === choice){
                nbr_choice = turn
            }
            turn = turn+1
        });

        var embed = new MessageEmbed()
        .setTitle(':envelope_with_arrow: Your vote as been registered')
        .setColor(0xda5d5d)
        .setTimestamp()
        .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128");

        if(new_amount != undefined){
            embed.setDescription('Your choice : '+nbr_choice+'\n New Currency Amount : '+new_amount+' :dollar:')
        }

        return embed
    },

    lock: function(interaction,params){
        var embed = new MessageEmbed()
        .setTitle(':lock: The Prediction As Been Locked')
        .setColor(0xda5d5d)
        .setDescription('Prediction ID : '+params[0].value)
        .setTimestamp()
        .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128");

        return embed

    },

    list: function(interaction,raw_polls){
            polls = []

            raw_polls.forEach(element => {
                if(element.prediction_identification[0].guild == interaction.guild_id){
                    polls.push(element)
                }
            });

                var embed = new MessageEmbed()
                .setTitle(':dividers: List Of Your Predictions')
                .setColor(0xda5d5d)
                desc = ""
                polls.forEach(element => {
                    desc = desc+":id: "+element.id+"\n :notepad_spiral: **"+element.prediction_config[1].value+"**\n :envelope_with_arrow: *"+element.prediction_users.length+"* Voters \n ------ \n"
                });
                
                embed.setDescription(desc)
                .setTimestamp()
                .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128");

        return embed

    },

    end: function(interaction,winner_pot,params,type,winner_nbr,users_nbr){
        if(type==="bet"){
            var embed = new MessageEmbed()
            .setTitle(':dollar: The Prediction As Been Ended')
            .setColor(0xda5d5d)
            .setDescription('All users have receive there bet. Prediction ID : '+params[0].value)
            .setTimestamp()
            .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
            .addFields(
                { name: 'Total Value Bet : '+winner_pot+'\n Total Winners : '+winner_nbr+'\n Total Betters : '+users_nbr, value: "-------"});

            return embed
        }
        if(type==="reward"){
            var embed = new MessageEmbed()
            .setTitle(':gift: The Prediction As Been Ended')
            .setColor(0xda5d5d)
            .setDescription('All users have receive there reward. Prediction ID : '+params[0].value)
            .setTimestamp()
            .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
            .addFields(
                { name: 'Total Value Rewarded : '+winner_pot*winner_nbr+'\n Total Winners : '+winner_nbr+'\n Total Betters : '+users_nbr, value: "-------"});

            return embed
        }
        if(type==="poll"){
            var embed = new MessageEmbed()
            .setTitle(':incoming_envelope: The Vote As Been Ended')
            .setColor(0xda5d5d)
            .setDescription('All votes have been collected. Prediction ID : '+params[0].value)
            .setTimestamp()
            .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
            .addFields(
                { name: 'Total Users Vote For :one: : '+winner_pot[0].length+'\n Total Users Vote For :two: : '+winner_pot[1].length+'\n Total Users Vote For :three: : '+winner_pot[2].length+'\n Total Users Vote For :four: : '+winner_pot[3].length+'\n Total Users Vote For :five: : '+winner_pot[4].length+'\n Total Users Vote For :six: : '+winner_pot[5].length, value: "-------"});

            return embed
        }
    }
}