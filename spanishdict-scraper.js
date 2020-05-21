const fetch = require("node-fetch");
const req_prom = require("request-promise");
const $ = require("cheerio");
const url = "https://www.spanishdict.com/translate/";
// "https://www.linguee.es/espanol-ingles/search?source=auto&query=";
let test = ["negar", "conllevar", "la pauta", "ganancia"];
let vocab_words = [];
let results = [];

// function calls
getFromSheet();
updateSheet();
console.log(results)

async function getFromSheet() {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/B3:B`;
    const request = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    });
    const data = await request.json();

    console.log(data)

    scrapeSpanishDict(vocab_words);

}

// update google sheet
function updateSheet() {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}:batchUpdate`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            requests: [{
                repeatCell: {
                    range: {
                        startColumnIndex: 0,
                        endColumnIndex: 1, 
                        startRowIndex: 0,
                        endRowIndex: 1,
                        sheetId: process.env.SHEET_PAGE
                    },
                    cell: {
                        userEnteredValue: {
                            "numberValue": 42
                        },
                    },
                    fields: "*"
                }
            }]
        })
    })
}

function scrapeSpanishDict(words) {
    let noArticle = false, curr_url, feminine;
    for (let word of words) {
        if (!wordCheck(word)) {
            curr_url = wordCheck(word);
        } else {
            noArticle = true;
            curr_url = url + word;
        }

        feminine = false;
        
        req_prom(curr_url).then(function(html){
            // english translation
            let translation = $("#quickdef1-es", html).text()
            let noun = $("._2MYNwPb3", html).text().toLowerCase().indexOf("noun") !== -1

            if (noArticle && noun) {
                feminine = $("._2MYNwPb3", html).text().toLowerCase().indexOf("feminine") !== -1

                if (feminine) {
                    word = "la " + word;
                } else {
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
            
            console.log(curr_obj)
            results[results.length] = curr_obj

        }).catch(function(err) {

        })

    }
}

// scrape words + add them result array
function scrapeLinguee(words) {
    for (let word of words) {
        let curr_url = wordCheck(word);
    
        req_prom.get({
            uri: curr_url,
            encoding: "binary"
        }, function (error, response, html) {
            if ($(".corrected", html).length > 0) {
                let correct_word = $(".corrected", html).text().replace(/\s/g, "")
                curr_url = url + correct_word;
            }
    
            // english translation
            let translation = $(".tag_trans > a", html)[0].children[0].data
    
            // verb / adjective / noun
            // noun
            // let noun = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("sustantivo") !== -1
            // // adjective
            // let adj = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("adjetivo") !== -1
            // verb
            let verb = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("verbo") !== -1
            if (verb) {
                translation = "to " + translation;
            }
            
            console.log(word + ' -> '+ translation)
    
            // example sentence
            let example = $("span.tag_e > span.tag_s", html).first().text()
            console.log("- sentence: " + example)
    
            results.push({
                word,
                translation,
                example
            })
    
        });
    
    }
}

// check for spanish article -> fix url
function wordCheck(word) {
    word = word.replace(/\s/g, "");
    let short_article = word.slice(0, 2).toLowerCase();
    let long_article = word.slice(0, 3).toLowerCase();

    if (short_article === "la" || short_article === "el" ||
        short_article === "un") {
        word = word.slice(2);
    } else if (long_article === "los" || long_article === "las" ||
        long_article === "una") {
        word = word.slice(3);
    } else {
        return false;
    }

    let new_url = url + word;
    return new_url;
}

