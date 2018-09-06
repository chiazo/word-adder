import edu.duke.FileResource;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.*;

import static org.jsoup.Jsoup.parse;

public class divideLine {

    private String fullSent;
    private String allText;
    private Character divider;
    private File input;
    private Document doc;


    public divideLine() throws IOException {

        fullSent = "";
        input = new File("/Users/chiazo/Desktop/igbowebsite.html");
        doc = parse(input, "UTF-8", " ");
    }

    public String extractSentence(FileResource f){
        //for(String s : f.lines()){
            /*startIndex = s.indexOf("\b") + 2;
            endIndex = s.lastIndexOf("\b"); */
           // fullSent = s.substring(s.indexOf("("), s.indexOf(")"));
            
            /*Elements boldTags = doc.getElementsByTag("b");
            allText = doc.body().text();
            return this.allText; */
        for (String s : f.lines()){
            String html = s;
            Document doc = Jsoup.parse(html);
            Element link = doc.select("a").first();

            String text = doc.body().text(); // "An example link"
            System.out.println(text);
        }



        //}
        return null;
    }



    public String parseLine(String line){
        FileResource f = new FileResource();
        String answer = extractSentence(f);
        /*String bold = divideInput("hello", "e", 5);
        String definition = divideInput("hello", "c", 5);;
        String igboSent = divideInput("hello", "c", 5);;
        String englSent = divideInput("hello", "c", 5);;
        return new addWords(String definition, String bold, String igboSent, String englSent); */
        return answer;
    }

    /*public static String divideInput(String s, String divider, int index){
        StringBuilder answer = new StringBuilder();
        for(int i = index; i<s.toString().length(); i++){
            if(s.substring(i, i+1).equals(divider)){
                answer.append();
            }
        }
        return answer.toString(); */

}
