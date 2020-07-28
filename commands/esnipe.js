const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils/utils")

module.exports = {
    name: "esnipe",
    description: "snipe the most recently edited message",
    category: "fun",
    aliases: ["es"],
    run: async (message, args) => {
        const { eSnipe } = require("../nypsi.js")

        let channel = message.channel

        if (args.length == 1) {
            if (!message.mentions.channels.first()) {
                return message.channel.send("❌ invalid channel")
            }
            channel = message.mentions.channels.first()
            if (!channel) {
                return message.channel.send("❌ invalid channel")
            }
        }

        if (!eSnipe || !eSnipe.get(channel.id)) {
            return message.channel.send("❌ nothing to edit snipe in " + channel.toString())
        }

        let content = eSnipe.get(channel.id).content

        if (content) {
            if (eSnipe.get(channel.id).attachments.url) {
                content = snipe.get(channel).attachments.url
            }
        }

        const created = new Date(eSnipe.get(channel.id).createdTimestamp)

        const color = getColor(message.member);

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(eSnipe.get(channel.id).member.user.tag)
            .setDescription(content)

            .setFooter(timeSince(created) + " ago")
        
        message.channel.send(embed)

    }
}

function timeSince(date) {

    const ms = Math.floor((new Date() - date));

    const days = Math.floor(ms / (24 * 60 * 60 * 1000))
    const daysms = ms % (24 * 60 * 60 * 1000)
    const hours = Math.floor((daysms) / (60*60*1000))
    const hoursms = ms % (60 * 60 * 1000)
    const minutes = Math.floor((hoursms) / (60 * 1000))
    const minutesms = ms % (60 * 1000)
    const sec = Math.floor((minutesms) / (1000))

    let output = ""

    if (days > 0) {
        output = output + days + "d "
    }

    if (hours > 0) {
        output = output + hours + "h "
    }

    if (minutes > 0) {
        output = output + minutes + "m "
    }

    if (sec > 0) {
        output = output + sec + "s"
    }

    return output
}