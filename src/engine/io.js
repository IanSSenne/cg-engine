const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { rows, columns } = process.stdout;
let last = "";
let next_update_id = 0;
module.exports.rows = rows;
module.exports.columns = columns;

let io = [];
populate_io();
function populate_io() {
    io = [];
    for (let i = rows; i > 0; i--) {
        io.push(Array(columns).fill(" "));
    }
    request_update();
}
module.exports.wipe = populate_io;
module.exports.set_char = (y, x, char = null) => {
    if (y < 0) {
        y = process.stdout.columns + y;
    }
    if (x < 0) {
        x = process.stdout.rows + x;
    }
    if (io[x]) {
        if (io[x][y]) {
            io[x][y] = char === null || char === undefined ? " " : char;
            next_offset = -2;
            request_update();
        }
    }
}
function request_update() {
    clearTimeout(next_update_id);
    next_update_id = setTimeout(update_screen, 10);
}
module.exports.request_update = request_update;
function update_screen() {
    let to_send = io.map(row => row.join("")).join("");
    if (last !== to_send) {
        process.stdout.cursorTo(0, -1);
        process.stdout.write(io.map(row => row.join("")).join(""));
        process.stdout.cursorTo(0, 0);
        to_send = last;
    }
    // next_update_id = setTimeout(update_screen);
}

module.exports.write_str = (x, y, str) => {
    if (!Array.isArray(str)) str = String(str);
    for (let i = 0; i < str.length; i++) {
        module.exports.set_char(x + i, y, str[i]);
    }
}