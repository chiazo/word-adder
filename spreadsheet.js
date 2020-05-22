const { GoogleSpreadsheet } = require("google-spreadsheet");
const cred = require("./client_secret.json");
const doc = new GoogleSpreadsheet(cred.spread_id)
// let num_of_rows = 1;
// let vocab_words = [];

module.exports = {
    vocab_words: [],
    getFromSheet: async function () {
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()

        const origin_sheet = doc.sheetsByIndex[0];

        await origin_sheet.loadCells("A2:A")
        let num_of_rows = origin_sheet.cellStats.nonEmpty
        const rows = await origin_sheet.getRows();

        let idx = 0;
        while (idx < num_of_rows) {
            this.vocab_words.push(rows[idx]._rawData[0])
            idx++
        }
        // console.log(this.vocab_words)
        return this.vocab_words
    },
    pushToSheet: async function (map) {
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()
        // console.log(doc.title)

        const output_sheet = doc.sheetsByIndex[2];
        if (output_sheet) {
            await output_sheet.delete();
        }

        const output = await doc.addSheet({
            headerValues:
                ["spanish", "english", "sentence"]
        })

        await output.updateProperties({ title: `Word-Adder: ${
            new Date().getMonth() + 1
        }-${ new Date().getDate()}` }).catch((e) => {
            console.log(e)
        }).then(() => {
            addInfo();
        })

    },
};

module.exports.getFromSheet()


/* USE TO UPDATE ORIGINAL DOCUMENT 
INSTEAD OF OUTPUTING NEW SHEET */
// doc.useServiceAccountAuth(cred, function (e) {

//     if (e) console.log("use service account error");

//     doc.getRows(1, function (e, rows) {
//         if (e) console.log("get rows error")
//         num_of_rows = rows.length
//     });

//     doc.getInfo(function (e, doc_info) {
//         if (e) console.log("====")
//         let sheet = doc_info.worksheets[0];
//         const lol = sheet.getRows()
//         console.log("lol:" + lol.length)
//     });

//     scrapeVocabWords();

// });

// function getAllCells(row, col) {
//     doc.useServiceAccountAuth(cred, function (e) {

//         if (e) console.log("use service account error");
//         doc.getInfo(function (e, doc_info) {
//             if (e || !doc_info) {
//                 console.log("====")
//                 console.log("error at " + row + ' - ' + col)
//                 console.log("====")
//             } else {
//                 let sheet = doc_info.worksheets[0];

//                 sheet.getCells({
//                     'min-row': row,
//                     'return-empty': false
//                 }, function (e, cells) {
//                     if (e || !cells) {
//                         console.log("====")
//                         console.log("error at " + row + ' - ' + col)
//                         console.log("====")
//                     } else {
//                         // var cell = cells[col]
//                         // if (cell && vocab_words.indexOf(cell.value) === -1) {
//                         //     vocab_words.push(cell.value)
//                         //     console.log(vocab_words)
//                         // }
//                     }


//                 });
//             }

//         });

//     });
// }

// function updateCell(row, col, obj) {
//     doc.useServiceAccountAuth(cred, function (e) {

//         doc.getInfo(function (e, doc_info) {

//             if (e) {
//                 console.log("====")
//                 console.log("error at " + row + ' - ' + col)
//                 console.log("====")
//             }

//             let sheet = doc_info.worksheets[0];
//             sheet.getCells({
//                 'min-row': row,
//                 'return-empty': true
//             }, function (e, cells) {
//                 var span = cells[col]
//                 var eng = cells[col + 1]
//                 var sent = cells[col + 2]

//                 span.value = obj.word;
//                 eng.value = obj.translation;
//                 sent.value = obj.example;

//                 span.save()
//                 eng.save()
//                 sent.save()

//             })

//         });

//     });
// }

// function scrapeVocabWords() {
//     let row = 3;
//     let count = 0;
//     let col = 0;

//     while (count < 3) {
//         getAllCells(row, col)
//         row++
//         count++
//     }

// }

