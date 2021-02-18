/**
 * If inStr = condStr, return outStr
 * @param {String} inStr input string
 * @param {String} condStrArr array of options inStr should be
 * @param {String} outStrArr output string array for each possibility
 */
const formatString = (inStr, condStrArr, outStrArr) => {
    const strIndex = condStrArr.indexOf(inStr)
    if (strIndex != -1) {
        return outStrArr[strIndex];
    }
}
export default formatString;