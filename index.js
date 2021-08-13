const path = require('path')
const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const dotenv = require('dotenv')
const findRemoveSync = require('find-remove')
const { v4: uuidv4 } = require('uuid')

dotenv.config()

// Create express
const app = express()

app.use(cors())
app.use(fileUpload())

// Adding Morgan to log incoming request to the console.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('common'))
}

app.use('/upload', function (req, res) {
  let userFile
  let extName
  let uploadPath
  let url

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      status: 'failed',
      message: 'No files were uploaded.',
      url: null,
    })
  }

  // The name of the input field (i.e. "userFile") is used to retrieve the uploaded file
  userFile = req.files.userFile
  extName = path.extname(userFile.name)
  userFile.name = uuidv4() + extName
  uploadPath = __dirname + '/files/' + userFile.name
  url = '/files/' + userFile.name

  // Use the mv() method to place the file somewhere on your server
  userFile.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send({
        status: 'failed',
        message: err.message,
        url: null,
      })

    res.send({
      status: 'success',
      message: null,
      url,
    })
  })
})

// Setting up static file serving from 'files' directory
app.use(express.static(path.join(__dirname, '/files')))

app.get('/files/:fileName', (req, res) =>
  res.sendFile(path.join(__dirname, 'files', req.params.fileName))
)

// Setting up file cleanup in '/files' directory for .pdf files older then 182 days
setInterval(() => {
  const result = findRemoveSync(path.join(__dirname, 'files'), {
    age: { seconds: process.env.FILE_AGE },
    extensions: '.pdf',
  })
  console.log('Deleted files: ', result)
}, process.env.DELETE_FILES_INTERVAL)

// Server initialization
const PORT = process.env.NODE_PORT || 2000
app.listen(PORT, console.log(`File Upload is running on port ${PORT}`))
