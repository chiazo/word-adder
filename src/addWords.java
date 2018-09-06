import edu.duke.FileResource;
import edu.duke.URLResource;

import java.awt.*;
import java.util.HashMap;


// this class will load igbo word, english word, igbo sentence, and english sentence into HashMaps

public class addWords {

    private HashMap<String, String> wordPairs;
    private HashMap<String, HashMap<String, String>> sentencePairs;
    private String igboWord;
    private String englishWord;
    private String igboSentence;
    private String englishSentence;


    public addWords(String definition, String bold, String igboSent, String englSent){
        igboWord = bold;
        englishWord = definition;
        igboSentence = igboSent;
        englishSentence = englSent;
    }

    public String getBold() {
        return igboWord;
    }

    public String getDefinition() {
        return englishWord;
    }

    public String getIgboSent() {
        return igboSentence;
    }

    public String getEnglSent() {
        return englishSentence;
    }

    public HashMap<String, String> fillMaps() {
        if(!wordPairs.containsKey(englishWord)) {
            wordPairs.put(englishWord, igboWord);
            //sentencePairs.put(englishWord, )
        }

        return wordPairs;
    }

    public HashMap<String, HashMap<String, String>> getSentencePairs() {
        return sentencePairs;
    }
}


