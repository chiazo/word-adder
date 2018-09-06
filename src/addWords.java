import edu.duke.FileResource;
import edu.duke.URLResource;

import java.awt.*;
import java.util.HashMap;


// this class will load igbo word, english word, igbo sentence, and english sentence into addWord object

public class addWords {

    private String test;
    private HashMap<String, String> wordPairs;
    private HashMap<String, HashMap<String, String>> sentencePairs;
    private String bold;
    private String definition;
    private String igboSent;
    private String englSent;
    private String[] answer;
    private int index;
    private FileResource fr;

    public addWords(String englishWord, String igboWord, String igboSentence, String englishSentence){
        bold = igboWord;
        definition = englishWord;
        igboSent = igboSentence;
        englSent = englishSentence;
    }

    /*private HashMap<String, String> loadWordMap() {
        return(" ");
    } */

    public String getBold() {
        return bold;
    }

    public String getDefinition() {
        return definition;
    }

    public String getIgboSent() {
        return igboSent;
    }

    public String getEnglSent() {
        return englSent;
    }
}


