const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = function(username, id, avatar) {
    const embed = new MessageEmbed()
    .setTitle(':page_facing_up: Infos about PollPy')
    .setColor(0xede905)
    .setDescription(':question: What\'s new :question:')
    .setTimestamp()
    .setAuthor(username, "https://cdn.discordapp.com/avatars/"+id+"/"+avatar+".webp?size=128")
    .addFields(
        { name: 'Latest DevLog :', value: ':desktop: **V1.0 :** \n - Majors and Minors bug fixing\n - Many New Commands (Users, Moderators and Admins)\n - New Ways To Communicate (Patreon, Web, Discord)\n - Boost for Supports ! \n - Multi-Language Planned'},
        { name: ':pushpin: Type of this version', value: 'Release Version : latest release of 22/08/2021'},
        { name: ':envelope: Author Credits : ', value: 'All right reserved to Proxyfil🦄#0001, please contact me for help or come here : https://discord.gg/KqxsnEDVqk and support me on patreon : https://www.patreon.com/proxyfil'});
    
    return embed;
}