import React, { Fragment, useState } from 'react'
import Message from './Message'
import Progress from './Progress'
import axios from 'axios'

const FileUpload = ({ isProcessing, setProcessing }) => {
  // const [processing, setProcessing] = useState(false)
  const [file, setFile] = useState('')
  const [filename, setFilename] = useState('Choose File')
  const [uploadedFile, setUploadedFile] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadPercentage, setUploadPercentage] = useState(0)

  const getQueryStringValue = (key) => {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          '^(?:.*[&\\?]' +
            encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
            '(?:\\=([^&]*))?)?.*$',
          'i'
        ),
        '$1'
      )
    )
  }

  // Would write the value of the QueryString-variable called name to the console

  const onChange = (e) => {
    setFile(e.target.files[0])
    setFilename(e.target.files[0].name)
  }

  const onSubmit = async (e) => {
    console.log('Submitting ')
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', file)
    const user_secret = getQueryStringValue('user_secret')
    const refund_type = getQueryStringValue('refund_type')
    const reason = getQueryStringValue('reason')
    if (user_secret && reason && refund_type) {
      try {
        const res = await axios.post(
          `/upload?user_secret=${user_secret}&reason=${reason}&refund_type=${refund_type}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              setUploadPercentage(
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
              )

              // Clear percentage and setting processing
              setUploadPercentage(0)
              setProcessing(true)
            },
          }
        )

        const { fileName, filePath, data } = res.data
        console.log({ data: res.data })
        setProcessing(false)
        setUploadedFile({ fileName, filePath, data })

        setMessage('File Uploaded Processing request')
      } catch (err) {
        setProcessing(false)

        setMessage('There was a problem with the server')
      }
    }
  }

  return (
    <Fragment>
      {isProcessing ? (
        <div className="h-100 w-100 d-flex justify-content-center align-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Fragment>
          {message.msg ? <Message msg={message.msg} /> : null}
          <form onSubmit={onSubmit}>
            <div className="custom-file mb-4">
              <input
                type="file"
                accept=".csv"
                className="custom-file-input"
                id="customFile"
                onChange={onChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {filename}
              </label>
            </div>

            <Progress percentage={uploadPercentage} />

            <input
              disabled={typeof file == 'string'}
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-4"
            />
          </form>
          {uploadedFile ? (
            <div className="row mt-5">
              <div className="col-md-6 m-auto">
                <h2 className="text-center">Report</h2>
                <h4
                  className={`text-center text-muted text-${
                    uploadedFile.data.status == 200 ? 'info' : 'danger'
                  }`}
                >
                  {uploadedFile.data.status == 200
                    ? 'Everything worked successfully'
                    : 'Error on the server please reach out to Leigh or Vaval '}
                </h4>
                <h6 className="text-center text-muted">
                  {new Date().toLocaleDateString()}
                </h6>
                <span className="text-muted mt-2">Save Report coming soon</span>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Order number</th>
                      <th scope="col">Result</th>
                      <th scope="col">Reason</th>
                      <th scope="col">Refunded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFile.data.report.map((result) => (
                      <tr>
                        <th scope="row">{result.order}</th>
                        <td>{result.msg}</td>
                        <td>{result.reason}</td>
                        <td>{result.type}</td>
                        <td>
                          <i
                            className={`fa-${
                              result.refunded
                                ? 'check text-success'
                                : 'times text-danger'
                            }`}
                          ></i>
                        </td>
                        <td>
                          {' '}
                          <a href={result.url}>View Order</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3 className="text-center">{uploadedFile.fileName}</h3>
                <img
                  style={{ width: '100%' }}
                  src={uploadedFile.filePath}
                  alt=""
                />
              </div>
            </div>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  )
}

export default FileUpload
