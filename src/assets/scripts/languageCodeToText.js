const languageCodeToText = (lc, optionArr) => {
    if (!optionArr) {
        optionArr = [
            { value: 'EN', text: 'English' },
            { value: 'CN', text: 'Chinese' },
            { value: 'KR', text: 'Korean' },
            { value: 'JP', text: 'Japanese' },
        ]
    }
    const language = optionArr.find(code => code.value == lc.language || lc.includes(code.value))
    if (language != undefined) {
      return language.text;
    }
}
export default languageCodeToText;