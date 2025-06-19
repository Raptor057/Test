import React, { useEffect, useState } from 'react'

const ErrorOverlay = () => {
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('_errors') || '[]')
    setErrors(saved)

    const originalAlert = window.alert

    window.alert = (message) => {
      const newEntry = { message, timeStamp: new Date().toISOString() }
      const updated = [newEntry, ...saved].slice(0, 10)

      localStorage.setItem('_errors', JSON.stringify(updated))
      setErrors(updated)
      setVisible(true)
    }

    return () => {
      window.alert = originalAlert
    }
  }, [])

  const handleClose = () => setVisible(false)

  if (!visible) return null

  return (
    <div
      onClick={handleClose}
      onKeyDown={handleClose}
      className="fixed inset-0 z-[9999] bg-black/90 text-white p-8 overflow-auto"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold border-b border-white pb-2">⚠ Se encontraron errores recientes</h2>

        <ul className="space-y-4">
          {errors.map((entry, i) => (
            <li key={`error_${i}`} className="bg-white/10 p-4 rounded">
              <p className="text-sm text-gray-300">
                {new Date(entry.timeStamp).toLocaleString()}
              </p>
              <p className="text-base text-red-400 font-mono">{entry.message}</p>
            </li>
          ))}
        </ul>

        <button
          onClick={handleClose}
          className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default ErrorOverlay
