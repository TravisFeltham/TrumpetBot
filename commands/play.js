const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addSubcommand(subcommand => {
            return subcommand
                .setName("search")
                .setDescription("Searches for a song.")
                .addStringOption(option => {
                    return option
                        .setName("search")
                        .setDescription("search keywords")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT")
                .addStringOption(option => {
                    return option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName("song")
                .setDescription("Plays song from YT")
                .addStringOption(option => {
                    return option
                        .setName("url")
                        .setDescription("song url")
                        .setRequired(true);
                })
        }),
        execute: async({client, interaction}) => {
            if (!interaction.member.voice.channel) {
                await interaction.reply("Please join a voice channel first.");
                return;
            }

            const queue = await client.player.createQueue(interaction.guild);

            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder();
            if(interaction.options.getSubcommand() === "song") {
                let url = interaction.options.getString("url");

                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                });

                if (result.tracks.length === 0) {
                    await interaction.reply("No results found.");
                }

                const song = result.tracks[0]
                await queue.addTrack(song);

                embed
                    .setDescription(`added **[${song.title}](${song.url})** to the queue.`)
                    .setFooter({text: `Duration: ${song.duration}`});
            } else if(interaction.options.getSubcommand() === "playlist") {
                let url = interaction.options.getString("url");

                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST,
                });

                if (result.tracks.length === 0) {
                    await interaction.reply("No playlist found.");
                }

                const playlist = result.playlist;
                await queue.addTracks(playlist.tracks);

                embed
                    .setDescription(`added **[${playlist.title}](${playlist.url})** to the queue.`)
                    .setFooter({text: `Duration: ${playlist.duration}`});
            } else if (interaction.options.getSubcommand() === "search") {
                let url = interaction.options.getString("search");

                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                });

                    if (result.tracks.length === 0) {
                    await interaction.reply("No results found.");
                }

                const song = result.tracks[0];
                await queue.addTrack(song);

                embed
                    .setDescription(`added **[${song.title}](${song.url})** to the queue.`)
                    .setFooter({text: `Duration: ${song.duration}`});
            }
            if(!queue.playing) await queue.play();
            await interaction.reply({
                embeds: [embed]
            })
        }
}
