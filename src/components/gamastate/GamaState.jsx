import React, { useState, useEffect } from 'react'
import commonApi from '../../utils/CommonApi'
import GamaStateItem from './components/GamaStateItem'

const GamaState = ({
  gamaState,
  partNo,
  lineCode,
  onGamaItemSelected,
  onGamaState,
  activeItem
}) => {
  const [hideFullPointsOfUse, setHideFullPointsOfUse] = useState(true)

  useEffect(() => {
    const fetchGama = async () => {
      if (partNo && lineCode) {
        commonApi.getLineMaterialStatus(lineCode, partNo, onGamaState, alert)
      } else {
        onGamaState([])
      }
    }
    fetchGama()
  }, [partNo, lineCode, onGamaState])

  const handleOnClick = () => {
    if (partNo && lineCode) {
      commonApi.getLineMaterialStatus(lineCode, partNo, onGamaState, alert)
      commonApi.updateLineBom(partNo, lineCode)
    } else {
      onGamaState([])
    }
  }

  const visibleItems = hideFullPointsOfUse
    ? gamaState.filter(item => item.capacity !== item.etis.length)
    : gamaState

  return (
    <div className="bg-white/10 text-white rounded p-4 shadow max-w-4xl mx-auto mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Gama {partNo || '-'} / {lineCode || '-'}
        </h3>
        <button
          onClick={handleOnClick}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold"
        >
          ACTUALIZAR
        </button>
      </div>

      <label className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          checked={hideFullPointsOfUse}
          onChange={(e) => setHideFullPointsOfUse(e.target.checked)}
          className="form-checkbox text-blue-500"
        />
        <span>Ocultar túneles llenos</span>
      </label>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-white/80 border-b border-white/20">
              <th className="px-4 py-2">Túnel</th>
              <th className="px-4 py-2">Componente</th>
              <th className="px-4 py-2 text-center">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item, idx) => (
              <GamaStateItem
                key={`${item.pointOfUseCode}_${item.componentNo}_${idx}`}
                item={item}
                onGamaItemSelected={onGamaItemSelected}
                activeItem={activeItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs mt-4">
        <h4 className="font-semibold mb-2">Código de Colores</h4>
        <div className="grid grid-cols-2 gap-2">
          <span className="bg-white text-red-600 px-2 py-1 rounded text-center">Túnel Vacío</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">Túnel Parcial</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-center">Túnel Lleno</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">Túnel Sobrecargado</span>
        </div>
      </div>
    </div>
  )
}

export default GamaState
