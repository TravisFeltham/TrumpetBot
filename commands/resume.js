const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resumes the current song."),
    execute: async({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("Unfortunately, you cannot resume when there is no song playing.");
            return;
        }

        const song = queue.current;

        queue.setPaused(false);

        await interaction.reply(`${song.title} has been resumed.`)
    }

}
