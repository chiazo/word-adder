const {white} = require("chalk")

module.exports = class ProgressBar {
    constructor() {
        this.total;
        this.current;
        this.bar_length = process.stdout.columns - 21;
    }

    init(total) {
        this.total = total;
        this.current = 0;
        this.update(this.current)
    }

    update(curr) {
        this.current = curr;
        const curr_prog = this.current / this.total;
        this.draw(curr_prog)
    }

    draw(curr_prog) {
        const filledb_leng = (curr_prog * this.bar_length).toFixed(0)
        const emptyb_leng = this.bar_length - filledb_leng
        const filledb = this.getBar(filledb_leng, " ", white)
        const emptyb = this.getBar(emptyb_leng, "-")
        const percent = (curr_prog * 100).toFixed(2)

        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(
            `Current Status: [${filledb}${emptyb}]|${percent}%`
        ); 

    }

    getBar(leng, char, color = a => a) {
        let str = "";
        for (let i = 0; i < leng; i++) {
            str += char;
        }

        return color(str)
    }
}