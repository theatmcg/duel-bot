const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

let duelId = 0;

let openers = [
    "Get ready to battle...",
    "Fight!!",
    "Brace yourself for the upcoming battle...",
    "Ready yourself for a fierce 1v1...",
    "Don't get tilted..."
];

let finishers = [
    "you absolutely demolished ",
    "nice win against ",
    "farmed ",
    "bodied ",
    "destroyed "
];

let currentDuels = [];

// a way to store duel data for each indivudual server member
// could be super lengthy though
// let duelScores = {
//     183695880484814848: [
//         { 183695880484814848: [1, 2] },
//     ],
// }

let winScores = {
    183695880484814848: [0, 0]
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function startDuel(message) {
    let duel = {};

    let messageArray = message.content.split(" ");

    let prefix = messageArray[0];

    let player1 = messageArray[1];
    let player2 = "<@" + message.author.id + ">";

    // add error checking to see if players are actual discord tags

    if (prefix === '/duel') {
        message.reply(player1 + " started a duel with " + player2 +
            "\n" + openers[getRandomInt(openers.length - 1)] +
            "\n" + "**Duel ID:  " + duelId + "**");

        duel = {
            id: duelId,
            player1: player1,
            player2: player2
        }

        currentDuels.push(duel);

        duelId += 1;
    }
}

function acceptDuel() {
    // some way to accept a duel instead of forcing it
}

function removeDuelById(id) {
    for (const i in currentDuels) {
        if (id == currentDuels[i].id) {
            currentDuels.splice(i, 1);
        }
    }
}

function getDuelById(id) {
    for (const i in currentDuels) {
        if (id == currentDuels[i].id) {
            return currentDuels[i];
        }
    }

    return false;
}

function stopDuel(message) {
    let messageArray = message.content.split(" ");

    let prefix = messageArray[0];
    let suffix = messageArray[1];

    // add checking for correct and incorrect suffixes

    if (prefix === '/win') {

        if (!getDuelById(parseInt(suffix))) {
            return;
        }

        let duel = getDuelById(parseInt(suffix));
        let player1 = parseInt(duel.player1.replace("<", "").replace(">", "").replace("@", ""));
        let player2 = parseInt(duel.player2.replace("<", "").replace(">", "").replace("@", ""));
        let author = parseInt(message.author.id);

        if (author == player1) {
            winner = player1;
            loser = player2;
        } else {
            winner = player2;
            loser = player1;
        }

        if (winner in winScores) {
            winScores[winner] = winScores[winner][0] += 1;
        } else {
            winScores[winner] = [1, 0]
        }

        if (loser in winScores) {
            winScores[loser] = winScores[loser][1] += 1;
        } else {
            winScores[loser] = [0, 1]
        }

        message.reply("<@" + winner + ">" + finishers[getRandomInt(finishers.length - 1)] + "<@" + loser + ">" + "\n" +
            "**Duel #" + duel.id + " has ended.**");
        
        removeDuelById(duel.id);

    } else if (prefix === '/loss') {

    } else if (prefix === '/abort') {

    }
}

function showCurrentDuels(message) {
    // some way to show stats for win losses between players
}

function debugMode(message) {

}

client.on('ready', () => {
    console.log('Duelist is ready.');
});

client.on('messageCreate', (message) => {
    startDuel(message);
    stopDuel(message);
});

client.login(process.env.TOKEN);