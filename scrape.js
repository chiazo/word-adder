const req_prom = require("request-promise");
const $ = require("cheerio");
const url = "https://www.spanishdict.com/translate/";
// // "https://www.linguee.es/espanol-ingles/search?source=auto&query=";

let spread = require("./spreadsheet");
let input_words = [];
let results = [];

let word_map = new Map();

// TIMER
console.time("get words")
//

spread.getFromSheet().then(result => {
    console.timeEnd("get words")
    return result.slice(0, result.length - 1)
    
}).then((original_list) => {
    console.time("all scraped")
    input_words = original_list;
}).then(() => {
    
    scrapeSpanishDict(input_words).then((map) => {
        console.timeEnd("all scraped")
        console.time("done uploading")
        uploadToSheet(map);
    })
})

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

