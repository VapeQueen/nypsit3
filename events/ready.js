const { Client } = require("discord.js")
const { getRandomCommand } = require("../utils/commandhandler")
const { logger } = require("../utils/logger")
const { daysUntilChristmas } = require("../utils/utils")

/**
 * @param {Client} client
 * @param {Number} startUp
 */
module.exports = async (client, startUp) => {
    const games = [
        "$help | nypsi.xyz",
        "$help | tekoh.net",
        "$help | nypsi.xyz",
        "$help | nypsi.xyz",
        "$help | nypsi.xyz",
        "have you joined the $support server?",
        "x0x",
        "x0x",
        "x0x",
        "xmas",
    ]

    setTimeout(async () => {
        const a = await getRandomCommand()

        let game = games[Math.floor(Math.random() * games.length)]

        if (game == "x0x") {
            game = `$${a.name} - ${a.description}`
        } else if (game == "xmas") {
            game = `${daysUntilChristmas()} days until christmas`
        }

        client.user.setPresence({
            status: "dnd",
            activities: [
                {
                    name: game,
                },
            ],
        })
    }, 5000)

    setInterval(async () => {
        const a = await getRandomCommand()

        let game = games[Math.floor(Math.random() * games.length)]

        if (game == "x0x") {
            game = `$${a.name} - ${a.description}`
        } else if (game == "xmas") {
            game = `${daysUntilChristmas()} days until christmas`
        }

        client.user.setPresence({
            status: "dnd",
            activities: [
                {
                    name: game,
                },
            ],
        })
    }, 15 * 60 * 1000)

    const { commandsSize } = require("../utils/commandhandler")

    let memberCount = 0

    await client.guilds.cache.forEach((g) => {
        memberCount = memberCount + g.memberCount
    })

    logger.info("server count: " + client.guilds.cache.size.toLocaleString())
    logger.info("user count: " + memberCount.toLocaleString())
    logger.info("commands count: " + commandsSize)

    logger.info("logged in as " + client.user.tag)

    const now = Date.now()
    const timeTaken = (now - startUp) / 1000

    logger.info(`time taken: ${timeTaken}s\n`)
}
