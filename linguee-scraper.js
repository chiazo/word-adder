const req_prom = require("request-promise");
const $ = require("cheerio");
const url = "https://www.linguee.es/espanol-ingles/search?source=auto&query=";
let words = ["negar", "conllevar", "la pauta", "ganancia"];
let result = [];

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

        result.push({
            word,
            translation,
            example
        })

    });

    // req_prom(curr_url).then(function(html){
    //     if ($(".corrected", html).length > 0) {
    //         let correct_word = $(".corrected", html).text().replace(/\s/g, "")
    //         curr_url = url + correct_word;
    //     } 

    //     // english translation
    //         let translation = $(".tag_trans > a", html)[0].children[0].data
    //         console.log(translation)

    //     // verb / adjective / noun
    //         // noun
    //         let noun = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("sustantivo") !== -1
    //         // adjective
    //         let adj = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("adjetivo") !== -1
    //         // verb
    //         let verb = $("span > .tag_wordtype", html).text().toLowerCase().indexOf("verbo") !== -1

    //     // example sentence
    //         let example = $("span.tag_e > span.tag_s", html).text()

    //         result.push({
    //             word,
    //             translation,
    //             example
    //         })
    // }).catch(function(error){
    //     console.log(error)
    // });


}
// check for word article -> fix url
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
    }

    let new_url = url + word;
    return new_url;
}

