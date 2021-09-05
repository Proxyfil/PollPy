const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = function(error, username, id, avatar) {
    const embed =  new MessageEmbed()
            .setTitle(':no_entry_sign: An Error Occured :no_entry_sign:')
            .setColor(0xcc0000)
            .setDescription(':rotating_light: '+error+' :rotating_light:')
            .setTimestamp()
            .setAuthor(username, "https://cdn.discordapp.com/avatars/"+id+"/"+avatar+".webp?size=128")
            .addFields(
                { name: 'If the error makes no sense', value: 'Contact Proxyfil🦄#0001 for help or come here : https://discord.gg/KqxsnEDVqk'});

    return embed;
}