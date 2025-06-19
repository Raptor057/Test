import React from 'react'

const ErrorEntry = ({ message, timeStamp }) => {
  const lines = message.split('\n').filter((line) => line)

  return (
    <tr>
      <td
        style={{
          color: 'rgb(227, 96, 73)',
          whiteSpace: 'nowrap',
          minWidth: '6em',
          width: '6em',
          verticalAlign: 'top'
        }}
      >
        {new Date(timeStamp).toLocaleTimeString()}
      </td>
      <td style={{ verticalAlign: 'top' }}>
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </td>
    </tr>
  )
}

export default ErrorEntry
