const chalk = require("chalk");
const io = require("./io");
const { resolve } = require("path");
let input = "";
let cursor = (c) => new Date().getTime() % 1000 < 500 ? chalk.bgWhite(c) : chalk.bgGray(c);
let submit = () => { }




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
    console.log(key);
    if (key === '\u0003') {
        process.exit();
    }
    if (key === "\b") {
        input = input.substr(0, input.length - 1);
        return;
    }
    if (key === "\r") {
        return submit()
    }
    g = JSON.stringify(key)
    g = g.substr(1, g.length - 2);
    if (g[0] === "\\") {
        return;
    }
    input += g;
});

module.exports = function (x, y, width, question) {
    return new Promise((resolve) => {
        input = "";

        for (let i = 0; i < io.columns; i++) {
            io.set_char(i, -1, ' ');
        }
        io.write_str(0, io.rows - 1, question)
        const id = setInterval(() => {
            for (let i = 0; i < width; i++) {
                if (i < width) {
                    io.set_char(x + i, y, input[i] || "_");
                }
            }
            if (input.length < width) {
                io.set_char(x + input.length, y, cursor("_"));
            } else {
                input = input.substring(0, width);
            }
        }, 10);
        submit = () => {
            resolve(input);
            clearTimeout(id);
            for (let i = 0; i < io.columns; i++) {
                io.set_char(i, -1, ' ');
            }
            for (let i = 0; i < width; i++) {
                io.set_char(x + i, y, " ");
            }
            io.write_str(0, io.rows, " ".repeat(io.columns));
            submit = () => { }
        }
    })
}