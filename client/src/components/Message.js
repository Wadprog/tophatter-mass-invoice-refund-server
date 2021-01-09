import React from 'react'
import PropTypes from 'prop-types'

const Message = ({ msg, type = 'info' }) => {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {msg}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

Message.propTypes = {
  msg: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default Message
