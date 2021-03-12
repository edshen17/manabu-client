function languageLevelBars(languageData, index) {
    const level = languageData.level;
    const levelToNumber = {
      'A1': 0,
      'A2': 1,
      'B1': 2,
      'B2': 3,
      'C1': 4,
      'C2': 5
    }

    if (index >= levelToNumber[level]) {
      return { 'level-color-1': true }
    } 
    
    else {
      if (levelToNumber[level] == 5) return { 'level-color-3': true }
      return { 'level-color-2': true }
    }
  }
  
export default languageLevelBars;