const req_prom = require("request-promise");
const $ = require("cheerio");
const spandict = "https://www.spanishdict.com/translate/";
const linguee = "https://www.linguee.es/espanol-ingles/search?source=auto&query=";
const wordref = "https://www.wordreference.com/es/en/translation.asp?spen=";
const collinsdict = "https://www.collinsdictionary.com/us/dictionary/spanish-english/"

const cliProgress = require("cli-progress")
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})



let spread = require("./spreadsheet");
let input_words = [];
let results = [];

let word_map = new Map();

console.log("== Gathering User Preferences ==")
async function userInput() {
    return new Promise(function (resolve, reject) {
        var ask = function () {
            let userpref = {};
            readline.question("1. Enter source sheet index (starting from 0): ", function (idx) {
                index = parseInt(idx);
                if (index > 0) {
                    // internal ask() function still has access to resolve() from parent scope
                    userpref.idx = idx;
                    readline.question("2. Enter range (ex: A2:A) - ", function (range) {
                        userpref.range = String(range);
                        readline.question("3. Enter source (spandict, linguee, collinsdict) - ", function (source) {
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
}

userInput().then(obj => {
    beginScraping(obj)
})

async function beginScraping(obj) {
    console.log("")
    console.log("== Pulling Vocab Words ==")
    spread.getFromSheet(obj).then(result => {
        return result.slice(0, result.length - 1)
    }).then((original_list) => {

        input_words = original_list;
    }).then(() => {
        console.log("")
        console.log("== Scraping Definitions & Example Sentences ==")
        scrapeSpanishDict(input_words).then((map) => {
            console.log("")
            console.log("== Pushing Results to Google Sheets ==")
            return new Promise(() => {
                uploadToSheet(map)
            })

        })
    })
}

function uploadToSheet(map) {
    return spread.pushToSheet(map)
}

// spanishdict
async function scrapeSpanishDict(words) {
    let count = 1;
    bar2.start(words.length, count)
    let noArticle = false, curr_url, feminine, masculine;

    for (let word of words) {
        if (!wordCheck(word, spandict)) {
            curr_url = spandict + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word, spandict);
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
            count++;
            bar2.update(count)

            // console.log(curr_obj)

        }).catch(function (err) {
            console.log("error: " + err)
        })

    }
    bar2.stop();
    return word_map;
}

// wordref
async function scrapeWordRef(words) {
    let count = 1;
    bar2.start(words.length, count)
    let noArticle = false, curr_url, feminine, masculine;

    for (let word of words) {
        if (!wordCheck(word, spandict)) {
            curr_url = wordref + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word, wordref);
            noArticle = false;
        }

        await req_prom(curr_url).then(function (html) {
            feminine = false;
            // english translation
            let translation = $(".ToWrd", html)[1].text()
            let noun = $(".tooltip", html).first().text().toLowerCase().indexOf("n") !== -1

            if (noArticle && noun) {
                
                feminine = $(".POS2", html).first().text().toLowerCase().indexOf("feminine") !== -1
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
            count++;
            bar2.update(count)

        }).catch(function (err) {
            console.log("error: " + err)
        })

    }
    bar2.stop();
    return word_map;
}

// check for spanish article -> fix url
function wordCheck(word, url) {
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

