const io = require("./io");
const chalk = require("chalk");
let input = "";

const chars = [..."this is a test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"];


const box = () => {
    const { rows, columns } = process.stdout;

    for (let i = 1; i < rows - 2; i++) {
        io.set_char(0, i, '|');
        io.set_char(columns - 1, i, '|');
    }
    for (let i = 1; i < columns - 1; i++) {
        io.set_char(i, 0, "-")
        io.set_char(i, rows - 2, "-");
    }
    io.set_char(0, 0, "+");
    io.set_char(columns - 1, 0, "+");
    io.set_char(columns - 1, rows - 2, "+");
    io.set_char(0, rows - 2, "+");
};

setInterval(() => {
    box();
    io.write_str(1, 1, [...input, chalk.bgWhite(" "), ..." ".repeat(process.stdout.columns - 3 - input.length)]);
}, 50);









var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding('utf8');

// on any data into stdin
stdin.on('data', function (key) {
    // ctrl-c ( end of text )
    if (key === '\u0003') {
        process.exit();
    }
    if (key === "\b") {
        input = input.substr(0, input.length - 1);
        return;
    }
    if (key === "\r") {

    }
    g = JSON.stringify(key)
    g = g.substr(1, g.length - 2);
    if (g[0] === "\\") {
        return;
    }
    input += g;
});