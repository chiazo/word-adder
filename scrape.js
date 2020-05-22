const req_prom = require("request-promise");
const $ = require("cheerio");
const url = "https://www.spanishdict.com/translate/";
// // "https://www.linguee.es/espanol-ingles/search?source=auto&query=";

let spread = require("./spreadsheet");
let input_words = [];
let results = [];

let word_map = new Map();

// spread.getFromSheet().then(result => {
//     return result
// }).then((original_list) => {
//     input_words = original_list;
// }).then(() => {
//     scrapeSpanishDict(input_words.splice(0, 5));
// })

scrapeSpanishDict(["bonito", "verdad", "papel", "el origen", "un problema"])

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
 
        await req_prom(curr_url).then(function(html){
            console.log(curr_url)
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
            console.log(curr_obj)

        }).catch(function(err) {
            console.log("error: " + err)
        })

    }

    // console.log(word_map)
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
    }  else {
        return false;
    } 

    let new_url = url + word;
    return new_url;
}

