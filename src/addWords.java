

import java.util.HashMap;


// this class will load igbo word, english word, igbo sentence, and english sentence into HashMaps

public class addWords{

    private HashMap<String, String> wordPairs;
    private HashMap<String, String[]> sentencePairs;
    private VocabWord currWord;


    public addWords(VocabWord w){
        currWord = w;
        fillMaps();
    }

    private String getIgboWord() {
        return currWord.igboWord;
    }

    private String getEnglishDefinition() {
        return currWord.englishWord;
    }

    private String getIgboSentence() {
        return currWord.igboSentence;
    }

    private String getEnglishSentence() {
        return currWord.englishSentence;
    }

    private void fillMaps() {
        if(!wordPairs.containsKey(getEnglishDefinition())) {
            wordPairs.put(getEnglishDefinition(), getIgboWord());
        }
        if(!sentencePairs.containsKey(getEnglishDefinition())) {
            String[] currSentences = new String[2];
            currSentences[0] = getEnglishSentence();
            currSentences[1] = getIgboSentence();
            sentencePairs.put(getEnglishDefinition(), currSentences);
        }
    }

    public String[] getSentencePairs(String engWord) {
        return sentencePairs.get(engWord);
    }

    public VocabWord returnWord() {
        return currWord;
    }
}


