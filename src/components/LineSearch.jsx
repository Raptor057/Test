import React from 'react'
import materialLoadingApi from '../utils/MaterialLoadingApi'

const LineSearch = ({ onLineChanged, lineFilterRef }) => {
  const handleOnSubmit = (e) => {
    e.preventDefault()
    const ref = lineFilterRef.current
    if (ref && ref.value) {
      materialLoadingApi.getPointOfUseLines(
        ref.value,
        (lines) => {
          if (lines.length > 0) {
            materialLoadingApi.getLineByCode(lines[0], onLineChanged, alert)
          } else {
            onLineChanged(null)
          }
        },
        alert
      )
    } else {
      onLineChanged(null)
    }
  }

  return (
    <form onSubmit={handleOnSubmit} className="max-w-xl mx-auto my-6 p-4 bg-white/10 rounded shadow">
      <label className="block mb-2 text-sm font-medium text-white">Código de Túnel</label>
      <input
        type="text"
        ref={lineFilterRef}
        placeholder="Ej: TNL-01"
        autoFocus
        className="w-full px-4 py-2 text-lg text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-2 text-sm text-white/80">
        Ingresar el código de túnel para seleccionar la línea.
      </p>
    </form>
  )
}

export default LineSearch
