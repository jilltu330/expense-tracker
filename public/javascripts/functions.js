const functions = {
  dateConvert: function dateConvert(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const mStr = month > 9 ? month : '0' + month
    const dStr = day > 9 ? day : '0' + day
    return `${year}-${mStr}-${dStr}`
  }
}

module.exports = functions
