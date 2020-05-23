const { GoogleSpreadsheet } = require("google-spreadsheet");
const cred = require("./client_secret.json");
const doc = new GoogleSpreadsheet(cred.spread_id)
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})


module.exports = {
    vocab_words: [],
    userInput: function () {
        return new Promise(function (resolve, reject) {
            var ask = function () {
                let userpref = {};
                readline.question("1. Enter sheet index: ", function (idx) {
                    index = parseInt(idx);
                    if (index > 0) {
                        // internal ask() function still has access to resolve() from parent scope
                        userpref.idx = idx;
                        readline.question("2. Enter range (ex: A2:A) - ", function (range) {
                            userpref.range = String(range);
                            readline.question("3. Enter source (spandict, linguee, wordref, collinsdict) - ", function (source) {
                                userpref.source = source;
                                console.log("")
                                console.log('\x1b[36m%s\x1b[0m', "current settings: ")
                                console.log(userpref)
                                
                                readline.question("Is everything correct? (Y/N) ", (yes) => {
                                    if (yes.toLowerCase() === "y") {
                                        resolve(userpref, reject)
                                    } else {
                                        console.clear();
                                        ask();
                                    }
                                })
                            })
                        })
                    } else {
                        ask();
                    }
                });
            };
            ask();
        });
    },
    getFromSheet: async function (userpref) {
       
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()

        const origin_sheet = doc.sheetsByIndex[userpref.idx];

        await origin_sheet.loadCells(`${userpref.range}`)
        let num_of_rows = origin_sheet.cellStats.nonEmpty
        const rows = await origin_sheet.getRows();

        let idx = 0;

        while (idx < num_of_rows) {
            this.vocab_words.push(rows[idx]._rawData[0])
            idx++
        }

        console.log(this.vocab_words)
        return this.vocab_words
    },
    pushToSheet: async function (map) {
        await doc.useServiceAccountAuth(cred)
        await doc.loadInfo()
        // console.log(doc.title)

        // const output_sheet = doc.sheetsByIndex[2];
        // if (output_sheet) {
        //     await output_sheet.delete();
        // }

        const output = await doc.addSheet({
            headerValues:
                ["word", "translation", "example"]
        })

        await output.updateProperties({
            title: `Word-Adder ${
                new Date().getMonth() + 1
                }-${new Date().getDate()}`
        }).then(() => {
            addInfo(map);
        }).catch((e) => {
            console.log(e)
        })

    },
};

function addInfo(word_map) {

    console.time("adding info")
    let all_objs = Array.from(word_map.values())

    const sheet = doc.sheetsByIndex[2];
    sheet.addRows(all_objs)
    console.timeEnd("adding info")
}


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

const req_prom = require("request-promise");
const $ = require("cheerio");
const url = "https://www.spanishdict.com/translate/";

let input_words = [];
let results = [];
let word_map = new Map();
let spread = require("./spreadsheet")

// TIMER
// spread.userInput();

async function start() {
    var input =  await spread.userInput();

    spread.getFromSheet(input).then((result) => {
        console.log("result: " + result)
    })
    process.exit()
    // spread.getFromSheet(input).then(result => {
    //     console.timeEnd("get words")
    //     return result.slice(0, result.length - 1)
    
    // }).then((original_list) => {
    //     console.time("all scraped")
    //     input_words = original_list;
    // }).then(() => {
    
    //     scrapeSpanishDict(input_words).then((map) => {
    //         console.timeEnd("all scraped")
    //         console.time("done uploading")
    //         uploadToSheet(map);
    //     })
    // })
    
    // process.exit();
};

// start();

console.log(spread.getFromSheet({
    idx: 2, range: "B2:B", source: "spandict"
}))

function uploadToSheet(map) {
    spread.pushToSheet(map)
    console.timeEnd("done uploading")
}

async function scrapeSpanishDict(words) {

    let noArticle = false, curr_url, feminine, masculine;

    for (let word of words) {
        if (!wordCheck(word)) {
            curr_url = url + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word);
            noArticle = false;
        }

        await req_prom(curr_url).then(function (html) {
            feminine = false;
            // english translation
            let translation = $("#quickdef1-es", html).text()
            let noun = $("._2MYNwPb3", html).text().toLowerCase().indexOf("noun") !== -1

            if (noArticle && noun) {

                feminine = $("._2MYNwPb3", html).first().text().toLowerCase().indexOf("feminine") !== -1
                masculine = $("._2MYNwPb3", html).first().text().toLowerCase().indexOf("masculine") !== -1

                if (feminine) {
                    word = "la " + word;
                } else if (masculine) {
                    word = "el " + word;
                }
            }
            // example sentence
            let example = $("._1f2Xuesa", html).first().text()

            let curr_obj = {
                word,
                translation,
                example
            };

            word_map.set(word, curr_obj)
            results[results.length] = curr_obj
            // console.log(curr_obj)

        }).catch(function (err) {
            console.log("error: " + err)
        })

    }
    return word_map;
}

// check for spanish article -> fix url
function wordCheck(word) {
    word = word.replace(/\s/g, "");
    let short_article = word.slice(0, 2).toLowerCase();
    let long_article = word.slice(0, 3).toLowerCase();

    if (long_article === "los" || long_article === "las") {
        word = word.slice(3)
        if (word.slice(word.length - 2) === "es") {
            word = word.slice(0, word.length - 2)
        } else {
            word = word.slice(0, word.length - 1)
        }
    } else if (long_article === "una") {
        word = word.slice(3);
    } else if (short_article === "la" || short_article === "el" ||
        short_article === "un") {
        word = word.slice(2);
    } else {
        return false;
    }

    let new_url = url + word;
    return new_url;
}


