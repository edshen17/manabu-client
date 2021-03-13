const languageCodeToText = (lc, optionArr) => {
    if (!optionArr) {
        optionArr = [
            { value: 'en', text: 'English' },
            { value: 'zh', text: 'Chinese' },
            { value: 'ko', text: 'Korean' },
            { value: 'ja', text: 'Japanese' },
        ]
    }
    const language = optionArr.find(code => code.value == lc.language || lc.includes(code.value))
    if (language != undefined) {
      return language.text;
    }
}
export default languageCodeToText;