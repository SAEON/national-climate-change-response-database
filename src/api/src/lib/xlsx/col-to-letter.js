/**
 * Both of these were found on StackOverflow at different times
 * Don't know which is better
 */

export default col => {
  var temp
  var letter = ''
  while (col >= 0) {
    temp = col % 26
    letter = String.fromCharCode(temp + 65) + letter
    col = (col - temp - 1) / 26
  }
  return letter
}

// function col(num) {
//   let letters = ''
//   while (num >= 0) {
//     letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
//     num = Math.floor(num / 26) - 1
//   }
//   return letters
// }
