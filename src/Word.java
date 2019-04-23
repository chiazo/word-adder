class VocabWord {
    protected String igboWord;
    protected String englishWord;
    protected String igboSentence;
    protected String englishSentence;


    protected VocabWord(String definition, String bold, String igboSent, String englSent){
        igboWord = bold;
        englishWord = definition;
        igboSentence = igboSent;
        englishSentence = englSent;
    }
}
