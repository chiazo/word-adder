const { GoogleSpreadsheet } = require("google-spreadsheet");
const cred = require("./client_secret.json");
const doc = new GoogleSpreadsheet(cred.spread_id)
const cliProgress = require("cli-progress")

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

module.exports = {
    vocab_words: [],
    getFromSheet: async function (obj) {
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()

        const origin_sheet = doc.sheetsByIndex[obj.idx];
        
        await origin_sheet.loadCells(String(obj.range)).catch((e) => {
            console.log("Error: Invalid Range Input")
            process.exit(1)
        })
        let num_of_rows = origin_sheet.cellStats.nonEmpty
        const rows = await origin_sheet.getRows();

        let idx = 0;
        bar1.start(num_of_rows, idx)

        while (idx < num_of_rows) {
            this.vocab_words.push(rows[idx]._rawData[0])
            idx++
            bar1.update(idx)
        }
        bar1.stop();
        // console.log(this.vocab_words)
        return this.vocab_words
    },
    pushToSheet: async function (map) {
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()

        // const output_sheet = doc.sheetsByIndex[5];
        // if (output_sheet) {
        //     await output_sheet.delete();
        // }
     
        const output = await doc.addSheet({
            headerValues:
                ["word", "translation", "example"]
        }).then(() => {
            addInfo(map);
        }).catch((e) => {
            console.log("Error: Couldn't Add New Sheet")
            process.exit(1)
        })
        
        // await output.updateProperties({
        //     title: `Word-Adder ${
        //         new Date().getMonth() + 1
        //         }-${new Date().getDate()}-${new Date().getHours()}`
        // }).catch((e) => {
        //     console.log("Error: Duplicate Sheet Names")
        //     process.exit(1)
        // })

    },
};

async function addInfo(word_map) {
    let all_objs = Array.from(word_map.values())
    const sheet = doc.sheetsByIndex[doc.sheetsByIndex.length - 1];
    // console.time("adding all rows")
    sheet.addRows(all_objs).then(() => {
        // console.timeEnd("adding all rows")
        console.log("=== DONE! === ")
        process.exit(0)
    })
    
}

