//import edu.duke.URLResource;

import edu.duke.FileResource;
import edu.duke.URLResource;

import java.io.IOException;

class Main {

    public static void main(String[] args) throws IOException {

        FileResource f = new FileResource("/Users/chiazo/Desktop/igbowebsite.html");

        for(String line : f.lines()){
            parseLine pL = new parseLine();
            String currSentence = pL.extractSentence(line);
            if(!currSentence.equals("Top")){
                System.out.println(currSentence);
            }

        }






    }
}
