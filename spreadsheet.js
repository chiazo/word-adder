const { GoogleSpreadsheet } = require("google-spreadsheet");
const cred = require("./client_secret.json");
const doc = new GoogleSpreadsheet(cred.spread_id)
let num_of_rows = 380;
let vocab_words = [];

go();

async function go() {
    await doc.useServiceAccountAuth(cred)
    await doc.loadInfo()
    console.log(doc.title)
}




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

