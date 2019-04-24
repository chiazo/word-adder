class VocabWord {
    private String igboWord;
    private String englishWord;
    private String igboSentence;
    private String englishSentence;


    VocabWord(String definition, String bold, String igboSent, String englSent){
        if (definition.length() == 0 || bold.length() == 0 || igboSent.length() == 0 || englSent.length() == 0) {
            throw new IllegalArgumentException("the term is empty");
        }

            englishWord = definition;
            igboWord = bold;
            igboSentence = igboSent;
            englishSentence = englSent;

    }

     String getIgboWord() {
        return igboWord;
    }

     String getEnglishDefinition() {
        return englishWord;
    }

     String getIgboSentence() {
        return igboSentence;
    }

     String getEnglishSentence() {
        return englishSentence;
    }

    public String[] getSentencePairs() {

        return new String[]{igboSentence, englishSentence};
    }

    public VocabWord returnWord() {
        return this;
    }
}
