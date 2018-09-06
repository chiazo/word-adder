//import edu.duke.URLResource;

import edu.duke.FileResource;
import edu.duke.URLResource;

import java.io.IOException;

class Main {

    public static void main(String[] args) throws IOException {
	// write your code here
        //private URLResource

           // addWords ad = new addWords();
            //URLResource url = new URLResource("http://www.igbofocus.co.uk/Igbo-Language/Learn-Some-Every-Day-Igbo-Word/learn-some-every-day-igbo-words.html");
        FileResource f = new FileResource("/Users/chiazo/Desktop/igbowebsite.html");
           // String insert = "aback wega azu (ha wega mụ azu - they took me back or they surprise me)";
            //String[] answer = ad.scanURL(insert);
            /*for(int i = 0; i<answer.length; i++){

                System.out.println(answer[i]);
            } */
            divideLine split;
        split = new divideLine();
        String alltext = split.extractSentence(f);
        System.out.println(alltext);



    }
}
