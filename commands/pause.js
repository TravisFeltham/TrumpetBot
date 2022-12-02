const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pauses the current song."),
    execute: async({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("You can't pause a song if there's no song playing.");
            return;
        }

        const song = queue.current;

        queue.setPaused(true);

        await interaction.reply(`${song.title} has been paused.`)
    }

}
