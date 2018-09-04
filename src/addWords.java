import edu.duke.URLResource;

import java.util.HashMap;

// this class will divide lines into igbo word, english word, igbo sentence, and english sentence

public class addWords {

    private URLResource url;
    private HashMap<String, String> wordPairs;
    private HashMap<String, HashMap<String, String>> sentencePairs;
    private String bold;
    private String definition;
    private String igboSent;
    private String englSent;
    private int index;

    public addWords(){
        url = new URLResource("http://www.igbofocus.co.uk/Igbo-Language/Learn-Some-Every-Day-Igbo-Word/learn-some-every-day-igbo-words.html");
        wordPairs = new HashMap<>();
        sentencePairs = new HashMap<>();
        bold = "";
        definition = "";
        igboSent = "";
        englSent = "";
        index = 0;
    }

    //private void

}
