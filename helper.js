/**
 *
 * All Little Functions too small to be their own module
 */

const fs = require('fs')
//Dependencies
const constants = require('./constants')

//Main object to return
const helper = {}
helper.abbrRefundType = (abbreviation) => {
  switch (abbreviation) {
    case 'Credit':
      return 'Issue Refund (Credit)'
      break
    case 'Cash':
      return 'Issue Refund (Cash)'
      break
    case 'Credit_to_Cash':
      return 're-Issue Refund (Credit to Cash)'
      break
    default:
      return false
  }
}
helper.createRange = (first_number, second_number) => {
  first_number =
    typeof parseInt(first_number) == 'number' ? parseInt(first_number) : false
  second_number =
    typeof parseInt(second_number) == 'number' ? parseInt(second_number) : false
  if (second_number && first_number) {
    if (first_number > second_number) {
      console.log('First number is less')
      const temporary_number = first_number
      second_number = first_number
      first_number = temporary_number
    }

    let range = []

    for (
      let current_number = first_number;
      current_number < second_number + 1;
      current_number++
    )
      range.push(current_number)

    if (range.length > 0) {
      return range
    } else {
      return false
    }
  } else return false
}

helper.getClientOrderPageURL = (user_secret, userID) => {
  const { BASE_URL } = constants

  return `${BASE_URL}${userID}/invoices?user_secret=${user_secret}`
}

helper.inform_success = (msg) => {
  console.log(msg)
}

helper.csvToArray = (pathTocsv) => {
  let array = []
  let data = fs.readFileSync(pathTocsv, 'UTF-8')
  //data = data.split(',')
  data = data.split(/\r?\n/).toString().split(',')

  for (let item of data) {
    if (parseInt(item)) {
      array.push(parseInt(item))
    }
  }

  return array
}

helper.getInvoiceUrl = (order, secret) => {
  return `https://tophatter.com/admin/invoices/${order}?user_secret=${secret}`
}

function test() {
  let array = helper.csvToArray(`${__dirname}/uploads/Book1.csv`)
  console.log({ array })
}

module.exports = helper
