# Word-Adder
A JS program that originally parsed igbo words + definitions and now updates spanish vocab lists hosted on google sheets to include defintions & example sentences

## Instructions
1. git clone this repository
2. follow this [tutorial](https://www.fastcomet.com/tutorials/nodejs/google-spreadsheet-package) to get your credential JSON & add it to your repo
3. Save this file as **`client_secret.json`**
4. Add the a variable named **`spread_id`** to the JSON file and initalize its value with your Google Sheet id (found in its url)
5. in the terminal, run `node scrape.js` and follow the CLI instructions (note: sheet index refers to the sheets located in your google doc; the first sheet is index 0)

## Built With
* [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) - js google sheets api wrapper
* [cheerio](http://cheerio.js.org/) - js web scrapper
* [spanishdict](https://www.spanishdict.com/) - source of spanish translations & sentences
* [igbofocus](http://www.igbofocus.co.uk/Igbo-Language/Learn-Some-Every-Day-Igbo-Word/learn-some-every-day-igbo-words.html) - source of igbo translations & sentences
* [cli-progess](https://www.npmjs.com/package/cli-progress) - terminal progress bar

## Results
* [igbo quizlet deck](https://quizlet.com/_6j7wyw)
* *Tools / Languages / Concepts*: Node.js, Promises/Async/Await, Javascript, CLI, Google Sheets API, JSON 

## Author
[Chiazo Agina](https://chiazo.github.io)

## Acknowledgments + Credits
* [A great google sheets tutorial](https://www.fastcomet.com/tutorials/nodejs/google-spreadsheet-package)  - used to access Google Sheets API

## License

This project is available under the [MIT License](LICENSE.md) - see the linked file for more details.