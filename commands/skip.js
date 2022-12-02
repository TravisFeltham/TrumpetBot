const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skips the current song."),
    execute: async({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("You can't skip a song if there's no songs in the queue.");
            return;
        }

        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`skipped **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }

}
