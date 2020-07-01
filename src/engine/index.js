const io = require("./io");
const chalk = require("chalk");
const input = require("./input");
const box = () => {
    const { rows, columns } = process.stdout;

    for (let i = 1; i < rows - 2; i++) {
        io.set_char(0, i, '|');
        io.set_char(columns - 1, i, '|');
    }
    for (let i = 1; i < columns - 1; i++) {
        io.set_char(i, 0, "-");
        io.set_char(i, rows - 2, "-");
    }
    io.set_char(0, 0, "+");
    io.set_char(columns - 1, 0, "+");
    io.set_char(columns - 1, rows - 2, "+");
    io.set_char(0, rows - 2, "+");
};

// setInterval(() => {
box();
// }, 50);

async function app() {
    io.write_str(1, 1, "name?");
    io.write_str(1, 2, "class?");
    const name = await input(7, 1, 10, "please enter your name");
    io.write_str(7, 1, name);
    const klass = await input(8, 2, 10, "please enter your class");
    io.write_str(8, 2, klass);
}

app();