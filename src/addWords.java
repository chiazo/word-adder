

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;


// this class will load igbo word, english word, igbo sentence, and english sentence into HashMaps

public class addWords {

    private Map<String, String> wordPairs;
    private Map<String, HashMap<String, String>> sentencePairs;
    private VocabWord currWord;

    private addWords() {
        wordPairs = new TreeMap<>();
        sentencePairs = new TreeMap<>();
    }

    private void fillMaps(VocabWord word) {
        if (!wordPairs.containsKey(word.getEnglishDefinition())) {
            wordPairs.put(word.getEnglishDefinition(), word.getIgboWord());
        }
        if (!sentencePairs.containsKey(word.getEnglishDefinition())) {
            HashMap<String, String> currSentences = new HashMap<>();
            currSentences.put(word.getIgboSentence(), word.getEnglishSentence());
            sentencePairs.put(word.getEnglishDefinition(), currSentences);
        }
    }

    private Map<String, String> getWordPairs() {
        return this.wordPairs;
    }

    private Map<String, HashMap<String, String>> getSentencePairs() {
        return this.sentencePairs;
    }

    private void extractSentence(Document doc) {
        Element bold = doc.select("b").first();
        Element p = doc.select("p").first();
        if ((bold != null) && (p != null)) {
            String igboWord = bold.text();
            String englishAndSentence = p.ownText().toLowerCase();
            String[] splitEngWord = englishAndSentence.split("[\\(||//)]");
            if (splitEngWord.length > 1) {
                String[] splitSent = splitEngWord[1].split("- |\\;");
                if (splitSent.length > 1) {
                    currWord = new VocabWord(splitEngWord[0].trim(), igboWord.trim(), splitSent[0].trim(), splitSent[1].trim());
                    fillMaps(currWord);
                }
            }
        } else {
            currWord = new VocabWord("", "", "", "");
        }

    }


    public static void main(String[] args) throws IOException {
        File input = new File("igbowords.html");
        Document doc = Jsoup.parse(input, "UTF-8", "http://www.igbofocus.co.uk/Igbo-Language/Learn-Some-Every-Day-Igbo-Word/learn-some-every-day-igbo-words.html");
        addWords add = new addWords();
        FileReader fr = new FileReader(input);
        BufferedReader br = new BufferedReader(fr);
        Map<String, String> wordPairs;
        Map<String, HashMap<String, String>> sentencePairs;
        String html = br.readLine();
        while (html != null) {
            try { add.extractSentence(Jsoup.parse(html));
            } catch (IllegalArgumentException e) {
                // nothing needs to happen here
            } finally {
                html = br.readLine();
            }

        }

        wordPairs = add.getWordPairs();
        sentencePairs = add.getSentencePairs();

        for(String word: wordPairs.keySet()) {
            System.out.println(word);
            System.out.println(sentencePairs.get(word));
        }



    }
}


