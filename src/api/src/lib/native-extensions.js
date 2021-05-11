String.prototype.toBoolean = function () {
  return this.toLowerCase().trim() === 'true'
}
