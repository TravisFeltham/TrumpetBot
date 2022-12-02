const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Ends the session"),
    execute: async({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("You can't pause a song if there's no song playing");
            return;
        }

        const currentSong = queue.current;

        queue.destroy();

        await interaction.reply("Thank you for using Trumpet Bot!")
    }

}
