import React from 'react'
import etiMovementsApi from '../utils/EtiMovementsApi'

const LoadedEtis = ({ line, gamaItem, onEtiRemoved }) => {
  const handleOnClick = (eti, button) => {
    button.disabled = true
    if (confirm(`Estas a punto de descargar la ETI "${eti.etiNo}". Presióna OK para continuar...`)) {
      etiMovementsApi.unloadEti('', eti.etiNo, line.code, '',
        () => {
          button.disabled = false
          onEtiRemoved(eti)
        },
        () => {
          button.disabled = false
        })
    } else {
      button.disabled = false
    }
  }

  return (
    <div className="bg-white/10 text-white rounded p-4 shadow max-w-3xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-2">
        {line.code || 'Línea'} / {gamaItem.pointOfUseCode || 'Túnel'} / {gamaItem.componentNo || 'Componente'}
      </h3>

      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {gamaItem.etis.map((item, idx) => {
            const effectiveTime = new Date(item.effectiveTime)
            return (
              <tr key={idx} className="bg-white/5 rounded">
                <td className="p-3 text-sm text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <b className="text-base">{item.etiNo}</b>
                      <br />
                      <span className="text-xs text-white/80">
                        Cargada el {effectiveTime.toLocaleDateString()} a las {effectiveTime.toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded"
                      onClick={(e) => handleOnClick(item, e.target)}
                    >
                      Descargar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LoadedEtis
