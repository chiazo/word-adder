

import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.*;
import java.util.*;


// this class will load igbo word, english word, igbo sentence, and english sentence into HashMaps

public class addWords {

    private Map<String, String> wordPairs;
    private Map<String, HashMap<String, String>> sentencePairs;
    private VocabWord currWord;
    private Set<VocabWord> allWords;

    private addWords() {
        wordPairs = new TreeMap<>();
        sentencePairs = new TreeMap<>();
        allWords = new HashSet<>();
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

    private Set<VocabWord> getAllWords() { return this.allWords; }

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
                    allWords.add(currWord);
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
        Set<VocabWord> allWords;
        String html = br.readLine();
        while (html != null) {
            try {
                add.extractSentence(Jsoup.parse(html));
            } catch (IllegalArgumentException e) {
                // nothing needs to happen here
            } finally {
                html = br.readLine();
            }

        }

        // copies over maps created in addWords object
        wordPairs = add.getWordPairs();
        sentencePairs = add.getSentencePairs();
        allWords = add.getAllWords();

        // initializes string to location of soon to be exported JSON file
        Gson gs = new Gson();
        String jsonFile = "exportedIgboWords.json";
        FileWriter fw = new FileWriter(jsonFile);
        String json = gs.toJson(allWords);
        System.out.println(json);
        fw.write(json);


    }
}


