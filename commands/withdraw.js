const {
    getBalance,
    getBankBalance,
    getMaxBankBalance,
    updateBalance,
    updateBankBalance,
    userExists,
    createUser,
    formatBet,
} = require("../utils/economy/utils.js")
const { Message } = require("discord.js")
const { Command, categories } = require("../utils/classes/Command.js")
const { ErrorEmbed, CustomEmbed } = require("../utils/classes/EmbedBuilders.js")
const { getPrefix } = require("../utils/guilds/utils")
const { isPremium, getTier } = require("../utils/premium/utils")

const tax = 0.05

const cooldown = new Map()

const cmd = new Command("withdraw", "withdraw money from your bank", categories.MONEY).setAliases(["with"])

/**
 * @param {Message} message
 * @param {Array<String>} args
 */
async function run(message, args) {
    if (!userExists(message.member)) createUser(message.member)

    let cooldownLength = 30

    if (isPremium(message.author.id)) {
        if (getTier(message.author.id) == 4) {
            cooldownLength = 10
        }
    }

    if (cooldown.has(message.member.id)) {
        const init = cooldown.get(message.member.id)
        const curr = new Date()
        const diff = Math.round((curr - init) / 1000)
        const time = cooldownLength - diff

        const minutes = Math.floor(time / 60)
        const seconds = time - minutes * 60

        let remaining

        if (minutes != 0) {
            remaining = `${minutes}m${seconds}s`
        } else {
            remaining = `${seconds}s`
        }
        return message.channel.send({ embeds: [new ErrorEmbed(`still on cooldown for \`${remaining}\``)] })
    }

    const prefix = getPrefix(message.guild)

    if (args.length == 0) {
        const embed = new CustomEmbed(message.member)
            .setTitle("withdraw help")
            .addField("usage", `${prefix}withdraw <amount>`)
            .addField("help", "you can withdraw money from your bank aslong as you have that amount available in your bank")
        return message.channel.send({ embeds: [embed] })
    }

    if (getBankBalance(message.member) == 0) {
        return message.channel.send({ embeds: [new ErrorEmbed("you dont have any money in your bank account")] })
    }

    if (args[0] == "all") {
        args[0] = getBankBalance(message.member)
    }

    if (args[0] == "half") {
        args[0] = getBankBalance(message.member) / 2
    }

    if (parseInt(args[0])) {
        args[0] = formatBet(args[0])
    } else {
        return message.channel.send({ embeds: [new ErrorEmbed("invalid amount")] })
    }

    let amount = parseInt(args[0])

    if (amount > getBankBalance(message.member)) {
        return message.channel.send({
            embeds: [new ErrorEmbed("you dont have enough money in your bank account")],
        })
    }

    if (!amount) {
        return message.channel.send({ embeds: [new ErrorEmbed("invalid payment")] })
    }

    if (amount <= 0) {
        return message.channel.send({ embeds: [new ErrorEmbed("invalid payment")] })
    }

    cooldown.set(message.member.id, new Date())

    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cooldownLength * 1000)

    const embed = new CustomEmbed(message.member, true)
        .setTitle("bank withdrawal | processing")
        .addField(
            "bank balance",
            "$**" +
                getBankBalance(message.member).toLocaleString() +
                "** / $**" +
                getMaxBankBalance(message.member).toLocaleString() +
                "**"
        )
        .addField("transaction amount", "-$**" + amount.toLocaleString() + "**")

    const m = await message.channel.send({ embeds: [embed] })

    updateBankBalance(message.member, getBankBalance(message.member) - amount)
    updateBalance(message.member, getBalance(message.member) + amount)

    const embed1 = new CustomEmbed(message.member, true)
        .setTitle("bank withdrawal | success")
        .setColor("#5efb8f")
        .addField(
            "bank balance",
            "$**" +
                getBankBalance(message.member).toLocaleString() +
                "** / $**" +
                getMaxBankBalance(message.member).toLocaleString() +
                "**"
        )

    embed1.addField("transaction amount", "-$**" + amount.toLocaleString() + "**")

    setTimeout(() => m.edit({ embeds: [embed1] }), 1500)
}

cmd.setRun(run)

module.exports = cmd
