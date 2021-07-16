export default col => {
  var temp
  var letter = ''
  while (col > 0) {
    temp = col % 26
    letter = String.fromCharCode(temp + 65) + letter
    col = (col - temp - 1) / 26
  }
  return letter
}
