const fiveDecimalRounding = function (number) {
    return Math.round((number + Number.EPSILON) * 100000) / 100000;
}

const getCurrentDate = function () { //format: dd-mm-yyyy
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`
}

module.exports = {
    fiveDecimalRounding,
    getCurrentDate
}