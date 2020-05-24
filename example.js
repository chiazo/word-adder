const req_prom = require("request-promise");
const $ = require("cheerio");
const spandict = "https://www.spanishdict.com/translate/";
const linguee = "https://www.linguee.es/espanol-ingles/search?source=auto&query=";
const wordref = "https://www.wordreference.com/es/en/translation.asp?spen=";
const collinsdict = "https://www.collinsdictionary.com/us/dictionary/spanish-english/"


const cliProgress = require("cli-progress")
const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

let ex = ["la mesa", "negar"]

let input_words = [];
let results = [];

let word_map = new Map();

// scrapeWordRef(ex)
// scrapeSpanishDict(ex)
scrapeLinguee(ex)

async function scrapeLinguee(words) {
    let noArticle = false, curr_url, feminine, masculine;
    for (let word of words) {

        if (!wordCheck(word, linguee)) {
            curr_url = linguee + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word, linguee);
            noArticle = false;
        }

        req_prom.get({
            uri: curr_url,
            encoding: "binary"
        }, function (error, response, html) {
            console.log(curr_url)
            // english translation
            let translation = $(".tag_trans > a", html).first().children().remove().end().text().trim()
            
            let noun = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("sustantivo") !== -1

            let verb = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("verbo") !== -1
            if (verb) {
                translation = "to " + translation;
            }
    
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
            let example = $("span.tag_e > span.tag_s", html).first().text()
            
            let obj = {
                word,
                translation,
                example
            }

            results.push(obj)
            console.log(obj)
    
        });
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
            console.log(html)
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

// linguee
async function scrapeLinguee(words) {
    let count = 1;
    bar2.start(words.length, count)
    let noArticle = false, curr_url, feminine, masculine;

    for (let word of words) {
        if (!wordCheck(word, linguee)) {
            curr_url = linguee + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word, linguee);
            noArticle = false;
        }

        await req_prom(curr_url).then(function (html) {
            console.log(html)
            feminine = false;
            // english translation
            let translation = $("#quickdef1-es", html).text()
            let noun = $("._2MYNwPb3", html).text().toLowerCase().indexOf("noun") !== -1

            // if (noArticle && noun) {

            //     feminine = $("._2MYNwPb3", html).first().text().toLowerCase().indexOf("feminine") !== -1
            //     masculine = $("._2MYNwPb3", html).first().text().toLowerCase().indexOf("masculine") !== -1

            //     if (feminine) {
            //         word = "la " + word;
            //     } else if (masculine) {
            //         word = "el " + word;
            //     }
            // }
            // // example sentence
            // let example = $("._1f2Xuesa", html).first().text()

            // let curr_obj = {
            //     word,
            //     translation,
            //     example
            // };

            // word_map.set(word, curr_obj)
            // results[results.length] = curr_obj
            // count++;
            // bar2.update(count)

            // console.log(curr_obj)

        }).catch(function (err) {
            console.log("error: " + err)
        })

    }
    bar2.stop();
    return word_map;
}

// wordref
// async function scrapeWordRef(words) {
//     let count = 1;
//     bar2.start(words.length, count)
//     let noArticle = false, curr_url, feminine, masculine;

//     for (let word of words) {
   
//         if (!wordCheck(word, wordref)) {
//             curr_url = wordref + word;
//             noArticle = true;
//         } else {
//             curr_url = wordCheck(word, wordref);
//             noArticle = false;
//         }
     
//         await req_prom(curr_url).then(function (html) {
//             feminine = false;
            
//             const body = $.load(html, {
//                 decodeEntities: false
//             })
//             // english translation
//             let translation = $("td > ToWrd", html).first().text()
//             let noun = $(".tooltip", html).first().text().toLowerCase().indexOf("n") !== -1
            
            
//             // if (noArticle && noun) {
                
//             //     feminine = $(".POS2", html).first().text().toLowerCase().indexOf("feminine") !== -1
//             //     masculine = $("._2MYNwPb3", html).first().text().toLowerCase().indexOf("masculine") !== -1

//             //     if (feminine) {
//             //         word = "la " + word;
//             //     } else if (masculine) {
//             //         word = "el " + word;
//             //     }
//             // }
//             // // example sentence
//             // let example = $("._1f2Xuesa", html).first().text()

//             // let curr_obj = {
//             //     word,
//             //     translation,
//             //     example
//             // };

//             // word_map.set(word, curr_obj)
//             // results[results.length] = curr_obj
//             // count++;
//             // bar2.update(count)

//         }).catch(function (err) {
//             console.log("error: " + err)
//         })

//     }
//     // bar2.stop();
//     // return word_map;
// }

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

}