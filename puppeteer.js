/**
 *
 * This Has the code that control the Chrome * Browser for all automation
 *
 */

//Dependencies
const puppeteer = require('puppeteer')
// Custom dependencies
const { PUPPETEER_CONFIG } = require('./config')
const {
  createRange,
  getClientOrderPageURL,
  getInvoiceUrl,
} = require('./helper')

const refundOrderList = ({ range, reason }) => {
  let orders = []
  const orderTableRows = document.querySelectorAll(
    'table.table.table-striped > tbody >tr'
  )
  for (let tableRow of orderTableRows) {
    let secondTd = tableRow.querySelector('td').nextElementSibling
    if (secondTd) {
      let secondDiv = secondTd.querySelector('div').nextElementSibling
      let anchorTags = secondDiv.querySelector('span').querySelector('a')
        .nextElementSibling
      const url = anchorTags.href
      const urlArray = url.split('/')
      const number = urlArray[urlArray.length - 1]

      if (range.some((num) => num == number)) {
        let actionBtn = tableRow.querySelector('.dropdown')
        let refundBtn = actionBtn.querySelector('.dropdown-item.refund')

        if (refundBtn) {
          refundBtn.click()
          let select = document.querySelector('#refund-reason-type')

          let options = select.querySelectorAll('option')
          let refundReason = null

          for (let option of options) {
            console.log(option.value)
            if (option.value == 'account_takeover') {
              refundReason = option
              break
            }
          }
          select.value = reason
          const summitBtn = document.querySelector('#refund-issue')
        }
      }
      orders.push({ number, url })
    }
  }
}

async function closeOrderFromRange({
  firstNum,
  secondNum,
  reason,
  user_secret,
  userID,
  refund_type = 'Issue Refund (Cash)',
}) {
  const browser = await puppeteer.launch(PUPPETEER_CONFIG)
  const page = await browser.newPage()

  //Fire on each dialogs that pops up
  page.on('dialog', async (dialog) => {
    console.log('New Dialog')
    await dialog.accept()
  })

  try {
    //Creating a range with the provided orders
    const range = createRange(+firstNum, +secondNum)

    const obj = { firstNum, secondNum, reason, range, refund_type }

    const url = getClientOrderPageURL(user_secret, userID)
    await page.goto(url)
    await page.evaluate(async (obj) => {
      const { reason, range, refund_type } = obj

      const orderTableRows = document.querySelectorAll(
        'table.table.table-striped > tbody >tr'
      )

      for (let tableRow of orderTableRows) {
        let secondTd = tableRow.querySelector('td').nextElementSibling
        if (secondTd) {
          let secondDiv = secondTd.querySelector('div').nextElementSibling
          let anchorTags = secondDiv.querySelector('span').querySelector('a')
            .nextElementSibling
          const url = anchorTags.href
          const urlArray = url.split('/')
          const number = urlArray[urlArray.length - 1]

          if (range.some((num) => num == number)) {
            let actionBtn = tableRow.querySelector('.dropdown')

            let refundTypes = actionBtn.querySelectorAll(
              '.dropdown-item.refund'
            )
            let refundBtn = null
            for (let btn of refundTypes) {
              if (btn.innerText.includes(refund_type)) refundBtn = btn
            }

            if (refundBtn) {
              refundBtn.click()
              let select = document.querySelector('#refund-reason-type')

              if (select) {
                select.value = reason
                const summitBtn = document.querySelector('#refund-issue')
                if (summitBtn) summitBtn.click()
              }
            }
          }
        }
      }
    }, obj)
    await browser.close()
    return { status: 200 }
  } catch (e) {
    await browser.close()
    return { status: 500, error: e }
  }
}
const orderFromCSV = async (array, user_secret, refund_type, reason) => {
  if (array && user_secret && refund_type && reason) {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()
    const report = []
    const obj = { refund_type, reason, report }

    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    for (let order of array) {
      let url = getInvoiceUrl(order, user_secret)

      await page.goto(url)
      let result = await page.evaluate(async (obj) => {
        const { refund_type, reason, report } = obj

        let refundTypes = document.querySelectorAll('.dropdown-item.refund')
        if (refundTypes) {
          let refundBtn = null

          for (let btn of refundTypes) {
            const btnText = btn.innerText.toString()

            if (btnText.includes(refund_type)) refundBtn = btn
          }
          if (refundBtn) {
            refundBtn.click()
            let select = document.querySelector('#refund-reason-type')

            if (select) {
              select.value = reason
              const summitBtn = document.querySelector('#refund-issue')

              if (summitBtn) {
                summitBtn.click()
                return { refunded: true, msg: 'refunded', reason, refund_type }
              }
            }
          } else {
            return {
              refunded: false,
              msg: 'Refund type not found',
              reason,
              refund_type,
            }
          }
        } else {
          return {
            refunded: false,
            msg: 'Order not refundable',
            reason,
            refund_type,
          }
        }
      }, obj)
      report.push({ url, order, ...result })
    }
    console.log('end')
    console.log({ report })
    await browser.close()
    return { msg: 'done', report, status: 200 }
  }
  return { msg: 'done', status: 500 }
}
const test = () => {
  closeOrderFromRange({
    firstNum: 123064228,
    secondNum: 123080949,
    reason: 'account_takeover',
    user_secret: 'bcda3943acb5c6571970',
    userID: '3610760',
  })
}
//test()
module.exports = { closeOrderFromRange, orderFromCSV }
