import React, { useState } from 'react'
import materialLoadingApi from '../utils/MaterialLoadingApi'
import etiMovementsApi from '../utils/EtiMovementsApi'

const EtiLoad = ({
  pointOfUseRef,
  etiNoRef,
  selectedLineCode,
  selectedPartNo,
  selectedWorkOrderCode,
  onEtiAdded
}) => {
  const [pointsOfUse, setPointsOfUse] = useState([])
  const [etiInfo, setEtiInfo] = useState({
    componentNo: null,
    etiNo: null,
    pointOfUseCode: null,
    startTime: null,
    usageTime: null,
    endTime: null,
    isDepleted: false,
    status: null
  })

  const [statusColor, setStatusColor] = useState('bg-blue-500') // azul por default

  const handleOnEtiNoSubmit = (e) => {
    e.preventDefault()
    const etiNo = etiNoRef.current.value
    etiNoRef.current.disabled = true

    etiMovementsApi.getEtiInfo(etiNo, setEtiInfo)

    materialLoadingApi.getEtiPointsOfUse(
      etiNo,
      selectedPartNo,
      selectedLineCode,
      (data) => {
        setPointsOfUse([...data])
        if (data.length === 0) {
          setStatusColor('bg-red-600')
          alert(`ETI "${etiNo}" no corresponde con ningún punto de uso para la gama "${selectedPartNo} ${selectedLineCode}".`)
          etiNoRef.current.disabled = false
          pointOfUseRef.current.value = ''
          etiNoRef.current.focus()
        } else {
          setStatusColor('bg-green-600')
          etiNoRef.current.disabled = false
          pointOfUseRef.current.focus()
        }
      },
      () => {
        setPointsOfUse([])
        setStatusColor('bg-red-600')
        etiNoRef.current.disabled = false
        etiNoRef.current.focus()
      }
    )
  }

  const handleOnPointOfUseSubmit = (e) => {
    e.preventDefault()
    const pointOfUseCode = pointOfUseRef.current.value
    const etiNo = etiNoRef.current.value

    if (pointsOfUse.includes(pointOfUseCode)) {
      pointOfUseRef.current.disabled = true

      etiMovementsApi.loadEti(
        pointOfUseCode,
        etiNo,
        selectedLineCode,
        '005766',
        selectedPartNo,
        selectedWorkOrderCode,
        () => {
          pointOfUseRef.current.disabled = false
          onEtiAdded(pointOfUseCode, etiNo, etiInfo.componentNo)
          pointOfUseRef.current.value = ''
          etiNoRef.current.value = ''
          etiNoRef.current.focus()
          setStatusColor('bg-green-600')
        },
        () => {
          pointOfUseRef.current.disabled = false
          etiNoRef.current.focus()
          setStatusColor('bg-red-600')
        }
      )
    } else {
      setStatusColor('bg-red-600')
      alert(`ETI ${etiNo} solamente se puede cargar en los túneles: ${pointsOfUse.join(', ')}.`)
    }
  }

  return (
    <div className="bg-white/10 text-white rounded p-4 shadow space-y-4 max-w-3xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">ETI No.</label>
        <form onSubmit={handleOnEtiNoSubmit}>
          <input
            type="text"
            placeholder="ETI No."
            ref={etiNoRef}
            className="w-full p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      <div>
        <p className="text-sm">Componente: <b>{etiInfo.componentNo}</b> Rev {etiInfo.revision}</p>
      </div>

      <div>
        <div className={`w-full text-center py-2 rounded font-semibold ${statusColor}`}>
          {etiInfo.status || 'OK'}
        </div>
      </div>

      <div>
        <p className="text-sm">Túneles válidos: <b>{pointsOfUse.join(', ')}</b></p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Túnel</label>
        <form onSubmit={handleOnPointOfUseSubmit}>
          <input
            type="text"
            placeholder="Código"
            ref={pointOfUseRef}
            className="w-24 p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </div>
  )
}

export default EtiLoad
