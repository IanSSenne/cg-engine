const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { rows, columns } = process.stdout;
module.exports.rows = rows;
module.exports.columns = columns;

let io = [];
populate_io();
function populate_io() {
    io = [];
    for (let i = rows; i > 0; i--) {
        if (i != 1) {
            io.push(Array(columns).fill(" "));
        } else {
            io.push(Array(columns - 10).fill(" "));
        }
    }
}
module.exports.set_char = (y, x, char = null) => {
    if (y < 0) {
        y = process.stdout.columns + y;
    }
    if (x < 0) {
        x = process.stdout.rows + x;
    }
    if (io[x]) {
        if (io[x][y]) {
            io[x][y] = char === null ? " " : char;
        }
    }
}
let last = "";
function update_screen() {
    process.stdout.cursorTo(0, -1, () => {
        let to_send = io.map(row => row.join("")).join("");
        if (last !== to_send) {
            process.stdout.write(io.map(row => row.join("")).join(""));
            to_send = last;
        }
    });
    setTimeout(update_screen);
}

update_screen()

module.exports.write_str = (x, y, str) => {
    if (!Array.isArray(str)) str = String(str);
    for (let i = 0; i < str.length; i++) {
        module.exports.set_char(x + i, y, str[i]);
    }
}