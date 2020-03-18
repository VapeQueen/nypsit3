const snekfetch = require("snekfetch")
const { RichEmbed } = require("discord.js")
const { redditImage } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "snek",
    description: "get a random picture of a snek",
    category: "fun",
    run: async (message, args) => {
        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("❌ \ni am lacking permission: 'EMBED_LINKS'");
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 5 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }


            return message.channel.send("❌\nstill on cooldown for " + remaining );
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        const { body } = await snekfetch.get("https://www.reddit.com/r/snek.json?sort=top&t=day")
        
        const allowed = body.data.children.filter(post => !post.data.is_self)
        
        const chosen = allowed[Math.floor(Math.random() * allowed.length)]

        const a = await redditImage(chosen, allowed)

        if (a == "lol") {
            return message.channel.send("❌\nunable to find image")
        }

        const image = a.split("|")[0]
        const title = a.split("|")[1]
        let url = a.split("|")[2]
        const author = a.split("|")[3]

        url = "https://reddit.com" + url

        let color;

        if (message.member.displayHexColor == "#000000") {
            color = "#FC4040";
        } else {
            color = message.member.displayHexColor;
        }

        const embed = new RichEmbed()
            .setAuthor("u/" + author + " | r/snek")
            .setTitle(title)
            .setURL(url)
            .setColor(color)
            .setImage(image)
            .setFooter(message.member.user.tag + " | bot.tekoh.wtf", message.member.user.avatarURL)
            .setTimestamp();
        
        return message.channel.send(embed).catch(() => {
            return message.channel.send("❌ \ni may be lacking permission: 'EMBED_LINKS'");
        })
    }
}