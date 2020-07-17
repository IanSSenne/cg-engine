const io = require("./io");
const chalk = require("chalk");
const input = require("./input");
const fs = require("fs");
const KLASSES = ["mage"];
const { visible } = require("chalk");
async function write_str_slow(str, x, y, duration) {
    const letters = str.split("");
    const dur = duration / letters.length;

    for (let i = 0; i < letters.length; i++) {
        io.set_char(x + i, y, letters[i]);
        await new Promise((resolve) => setTimeout(resolve, dur));
    }
}
const arrow_keys = {
    up: "\u001b[A",
    down: "\u001b[B",
    right: "\u001b[C",
    left: "\u001b[D"
}
const box = () => {
    const { rows, columns } = process.stdout;

    for (let i = 1; i < rows - 2; i++) {
        io.set_char(0, i, '│');
        io.set_char(columns - 1, i, '│');
    }
    for (let i = 1; i < columns - 1; i++) {
        io.set_char(i, 0, "─");
        io.set_char(i, rows - 2, "─");
    }
    io.set_char(0, 0, "╭");
    io.set_char(columns - 1, 0, "╮");
    io.set_char(columns - 1, rows - 2, "╯");
    io.set_char(0, rows - 2, "╰");
};

// setInterval(() => {
io.wipe();
// }, 50);
const klasses = ['mage', 'archer', 'guard'];
async function create_player() {
    io.write_str(1, 15, "name?");
    io.write_str(1, 16, "class?");
    let name = "";
    do {
        name = await input.text(7, 15, 10, "please enter your name");
    } while (name.length <= 1);
    io.write_str(7, 15, name);
    let klass = "";
    do {
        klass = await input.text(8, 16, 10, `please select a class [${klasses}]`);
    } while (!klasses.includes(klass))
    io.write_str(8, 16, klass);
    return { name, class: klass };
}

async function menu() {
    let selected = null;
    let highlighted = 0;
    do {
        io.write_str(32, 20, ["new game", "load", "options"].map((text, index) => {
            if (highlighted != index) {
                return [...text, " ", " ", " "].map(c => chalk.gray(c))
            } else {
                return [...text, " ", " ", " "];
            }
        }).flat());
        const action = await input.keypress("please use the left and right arrow to choose an option and enter to select");
        if (action === arrow_keys.left) {
            highlighted--;
            if (highlighted < 0) highlighted = 2;
        } else if (action === arrow_keys.right) {
            highlighted++;
            highlighted %= 3;
        } else if (action === "\r") {
            selected = highlighted
        }
    } while (selected === null);
    io.wipe();
    sword_in_stone();
    switch (selected) {
        case 0:
            return new_character();
        case 1:
            return load_game();
        case 2:
            return options();
    }
}

async function new_character() {
    io.wipe();
    sword_in_stone();
    const player = await create_player();
    fs.writeFileSync("./save.json", JSON.stringify({ player, story_loc: 0 }));
    io.wipe();
    await write_str_slow("welcome adventurer! its a bright sunday morning here in [area].", 5, 10, 2000);
    await write_str_slow("now come the most important question of the day, would you like to awaken to adventure or return to sleep?", 5, 11, 2200);

    let answer = null;
    do {
        answer = await input.text(5, 12, 9, "would you like to [sleep] or [adventure]?");
    } while (answer !== "sleep" && answer !== "adventure");

    switch (answer) {
        case "sleep":
            await write_str_slow(`Our hero ${player.name} returns to his rest.`, 5, 14, 2000);
            await write_str_slow(`End of Demo...`, 5, 16, 10000);
            break;
        case "adventure":
            await write_str_slow(`Our hero ${player.name} jumps out of bed, into a suit of armor and runs out the door to adventure.`, 5, 14, 2000);
            await write_str_slow(`End of Demo...`, 5, 16, 10000);
            break;
    }
    process.exit(0);



    // io.write_str(5, 15, "name:");
    // const name = await input.text(12, 15, 10, "please enter a name for your character");
    // io.write_str(12, 15, name);
    // fs.writeFileSync("./save.json", JSON.stringify({ name, atk: 0, def: 0, hp: 100, last: 0 }));
}
async function load_game() {
    if (fs.existsSync("./save.json")) {
        return resume(JSON.parse(fs.readFileSync("./save.json")));
    } else {
        await input.keypress("no save found, please start a new game");
    }
}
async function options() {
    await input.keypress("Not Yet Implemented");
    return menu();
}
function sword_in_stone() {
    io.write_str(0, 01, String.raw`              /\           `)
    io.write_str(0, 02, String.raw`              ||           `)
    io.write_str(0, 03, String.raw`             ─┿┿─          `)
    io.write_str(0, 04, String.raw`              ||           `)
    io.write_str(0, 05, String.raw`              ||           `)
    io.write_str(0, 06, String.raw`              ||           `)
    io.write_str(0, 07, String.raw`          ____||_____      `)
    io.write_str(0, 08, String.raw`        _/  _______  \     `)
    io.write_str(0, 09, String.raw`       /   /       \_ \__  `)
    io.write_str(0, 10, String.raw`      /   /          \   \ `)
}
async function app() {
    sword_in_stone();
    try {
        await menu();
    } catch (e) {
        console.log(e);
        process.exit();
    }
}


app()
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}