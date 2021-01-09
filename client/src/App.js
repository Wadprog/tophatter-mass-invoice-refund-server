import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import './App.css'

const App = () => {
  const [isProcessing, setProcessing] = useState(false)

  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">
        {isProcessing
          ? 'Processing your request, get some ☕️'
          : ' Click below to upload a csv'}
      </h4>
      <FileUpload isProcessing={isProcessing} setProcessing={setProcessing} />
    </div>
  )
}

export default App
