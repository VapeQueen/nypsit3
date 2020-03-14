/*jshint esversion: 8 */
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../utils.js");

//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER
//MAKE LOOK MORE LIKE $SERVER

module.exports = {
    name: "user",
    description: "view info about a user",
    category: "info",
    run: async (message, args) => {
        
        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("❌ \ni am lacking permission: 'EMBED_LINKS'");
        }

        let member;

        if (args.length == 0) {
            member = message.member;
        } else {
            if (!message.mentions.members.first()) {
                member = getMember(message, args[0]);
            } else {
                member = message.mentions.members.first();
            }
        }

        if (!member) {
            return message.channel.send("❌ \ninvalid user");
        }
        
        const joined = formatDate(member.joinedAt);

        const created = formatDate(member.user.createdAt);

        let color;

        if (member.displayHexColor == "#000000") {
            color = "#FC4040";
        } else {
            color = member.displayHexColor;
        }

        const embed = new RichEmbed()
            .setThumbnail(member.user.avatarURL)
            .setColor(color)
            .setTitle(member.user.tag)
            .setDescription(member.user)
            
            .addField(member.displayName, stripIndents `**username** ${member.user.tag}
            **id** ${member.user.id}
            **status** ${member.presence.status}\n
            **created** ${created.toString().toLowerCase()}
            **joined** ${joined.toString().toLowerCase()}`)

            .setFooter(message.member.user.tag + " | bot.tekoh.wtf", message.member.user.avatarURL)
            .setTimestamp();
        
        if (member.presence.game && member.presence.game.toString().toLowerCase() != "custom status") {
            embed.addField("game", stripIndents `**currently playing** ${member.presence.game.name.toString().toLowerCase()}`);
        }

        message.channel.send(embed).catch(() => {
             return message.channel.send("❌ \ni may be lacking permission: 'EMBED_LINKS'");
        });
    }
};