/**
 *That will handle all the request  run a *puppeteer that will actually refund the orders s
 */

//Dependencies :
const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const cors = require('cors')
//Local dependencies
const config = require('./config')
const { closeOrderFromRange, orderFromCSV } = require('./puppeteer')
const { inform_success, csvToArray, abbrRefundType } = require('./helper')

//Configuring the server
const app = express()
app.use(express.json({ extended: false }))
app.use(express.static('upload'))
app.use(cors())
app.use(fileUpload())

//Responding to request base on the route

app.post('/upload', (req, res) => {
  if (req.files === null || req.files === undefined) {
    return res.status(400).json({ msg: 'No file uploaded' })
  }
  const file = req.files.file
  let { user_secret, reason, refund_type } = req.query
  refund_type = abbrRefundType(refund_type)
  if (!user_secret || !refund_type || !reason)
    return res.status(400).json({ msg: 'missing secret token' })

  file.mv(`${__dirname}/uploads/${file.name}`, async (err) => {
    if (err) return res.status(500).send(err)

    let orderNumbers = csvToArray(`${__dirname}/uploads/${file.name}`)
    console.log({ orderNumbers })
    try {
      let resp = await orderFromCSV(
        orderNumbers,
        user_secret,
        refund_type,
        reason
      )

      console.log({ ...resp })
      return res.json({
        fileName: resp.status,
        filePath: `/uploads/${file.name}`,
        data: resp,
      })
    } catch (err) {
      console.log({ res })

      return res.status(500).json({
        error: err,
        data: { msg: 'done', status: 200 },
      })
    }
  })
})
//Receive the order request.
app.post('/', async (req, res) => {
  console.log(req.body)
  try {
    let response = await closeOrderFromRange(req.body)
    console.log({ response })
    return res.json({ msg: 'processing refunds' })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ msg: error.message })
  }
})
app.get('/popup.js', async (req, res) => {
  console.log('\n\n I have been request \n\n')
  return res.sendFile(__dirname + '/uploads/popup.js')
})
//Sending  the react app
app.use(express.static('client/build'))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

// Start the server and listening on incoming requests
const { PORT, ENV_NAME } = config

app.listen(PORT, () =>
  inform_success(`Server running on port ${PORT} in ${ENV_NAME} environment`)
)
