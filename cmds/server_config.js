const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = { 
    config: function(interaction, args, config, server, curr_config) {
        role_config = config.role_config
        const embed = new MessageEmbed()
        .setTitle(':page_facing_up: Server Configuration')
        .setColor(0xede905)
        .setDescription('Here is the settings of your server :')
        .setTimestamp()
        .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
        .addFields(
            { name: ':key: Admin Role : '+role_config[0].admin_name+'\n:shield: Moderator Role : '+role_config[0].moderator_name+'\n:mobile_phone: User Role : '+role_config[0].user_name+'\n', value: '------'}
        );
        
        if(curr_config[0] != null){
            roles = "Default Currency Config : \n"
            for (const [key, value] of Object.entries(curr_config[0])) {
                roles = key + " : " + (value) + "\n"
                embed.addFields({ name: roles, value: '------'});
            }
        }
    return embed;
    }
}