const req_prom = require("request-promise");
const $ = require("cheerio");
const spandict = "https://www.spanishdict.com/translate/";
const linguee = "https://www.linguee.es/espanol-ingles/search?source=auto&query=";
const collinsdict = "https://www.collinsdictionary.com/us/dictionary/spanish-english/"

let ex = ["la mesa"]

let input_words = [];
let results = [];

let word_map = new Map();

scrapeCollins(ex)
// scrapeSpanishDict(ex)
// scrapeLinguee(ex);

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

async function scrapeCollins(words) {
    let noArticle = false, curr_url, feminine, masculine;
    for (let word of words) {
        if (!wordCheck(word, collinsdict)) {
            curr_url = collinsdict + word;
            noArticle = true;
        } else {
            curr_url = wordCheck(word, collinsdict);
            noArticle = false;
        }

        req_prom.get({
            uri: curr_url,
            encoding: "binary",
        }, function (error, response, html) {
          
            // english translation
            let descr = $(".rend-sc").first().text().toLowerCase()
            let translation = $(".type-translation").first().text().toLowerCase()

            let noun = descr.indexOf("noun") !== -1

            let verb = descr.indexOf("verb") !== -1
            // if (verb) {
            //     translation = "to " + translation;
            // }

            if (noArticle && noun) {

                feminine = descr.indexOf("feminine") !== -1
                masculine = descr.indexOf("masculine") !== -1

                if (feminine) {
                    word = "la " + word;
                } else if (masculine) {
                    word = "el " + word;
                }
            }
            // example sentence
            let example = $(".example_box:nth-child(2)", html).children().children().remove().end().text().trim().replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
            example = example[0].toUpperCase() + example.slice(1);
            console.log(example);

            let obj = {
                word,
                translation,
                example
            }

            results.push(obj)
            console.log(obj)

        });
    }

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

                // verb / adjective / noun
                // noun
                let noun = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("sustantivo") !== -1
                // // adjective
                // let adj = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("adjetivo") !== -1
                // verb
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

                    // console.log(curr_obj)

                }).catch(function (err) {
                    console.log("error: " + err)
                })

            }
            return word_map;
        }

    }
}
