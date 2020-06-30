const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

let io = [];
populate_io();
function populate_io() {
    io = [];
    for (let i = process.stdout.rows; i > 0; i--) {
        io.push(Array(process.stdout.columns).fill(" "));
    }
}
process.stdout.on("resize", () => {
    populate_io();
});

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
    setTimeout(update_screen, 10);
}

update_screen()

module.exports.write_str = (x, y, str) => {
    if (!Array.isArray(str)) str = String(str);
    for (let i = 0; i < str.length; i++) {
        module.exports.set_char(x + i, y, str[i]);
    }
}

console.clear();