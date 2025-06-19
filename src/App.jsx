import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'

// COMPONENTES
import LineSearch from './components/LineSearch'
import PartSelection from './components/PartSelection'
import EtiLoad from './components/EtiLoad'
import GamaState from './components/gamastate/GamaState'
import LoadedEtis from './components/LoadedEtis'
import ErrorOverlay from './components/erroroverlay/ErrorOverlay'

// SIGNALR
import * as signalR from '@microsoft/signalr'

const defaultState = {
  line: { id: null, code: null },
  workOrder: { code: null },
  pointOfUseCode: null,
  gamaState: [],
  gamaItem: { pointOfUseCode: null, componentNo: null, etis: [] }
}

const getSignalRClient = (name, url) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .build()

  const client = {
    start: async function start() {
      try {
        await connection.start({ withCredentials: false })
        console.log(`${name} Connected!`, url)
      } catch (err) {
        console.error(name, err)
        setTimeout(start, 3000)
      }
    },
    on: (event, callback) => {
      connection.on(event, callback)
      return client
    }
  }

  connection.onclose(async () => await client.start())

  return client
}

function App() {
  const [state, setState] = useState(defaultState)

  const etiNoRef = useRef(null)
  const pointOfUseRef = useRef(null)
  const lineFilterRef = useRef(null)
  const etiUsedHandlerRef = useRef(() => {})

  const handleOnLineChanged = (line) => {
    if (line) {
      setState({
        ...state,
        line,
        workOrder: { code: line.activeWorkOrderCode, partNo: line.activePart.number }
      })
      etiNoRef.current?.focus()
    } else {
      setState(defaultState)
      lineFilterRef.current?.focus()
    }
  }

  const handleOnWorkOrderChanged = (workOrder) =>
    setState({ ...state, workOrder })

  const handleOnGamaItemSelected = (item) =>
    setState({ ...state, gamaItem: item })

  const handleGamaState = (gamaState) =>
    setState({ ...state, gamaState })

  const handleOnEtiRemoved = (eti) => {
    const stateGamaItem = state.gamaState.find(
      (item) => item.componentNo === eti.componentNo && item.pointOfUseCode === eti.pointOfUseCode
    )
    if (stateGamaItem) {
      const gamaItem = {
        ...stateGamaItem,
        etis: stateGamaItem.etis.filter((item) => eti.etiNo !== item.etiNo)
      }
      setState({
        ...state,
        gamaState: state.gamaState.map((item) =>
          item.componentNo === gamaItem.componentNo && item.pointOfUseCode === gamaItem.pointOfUseCode
            ? gamaItem
            : item
        ),
        gamaItem:
          gamaItem.componentNo === state.gamaItem.componentNo &&
          gamaItem.pointOfUseCode === state.gamaItem.pointOfUseCode
            ? gamaItem
            : state.gamaItem
      })
    }
  }

  const handleOnEtiAdded = (pointOfUseCode, etiNo, componentNo) => {
    const stateGamaItem = state.gamaState.find(
      (item) => item.componentNo === componentNo && item.pointOfUseCode === pointOfUseCode
    )
    if (stateGamaItem) {
      const gamaItem = {
        ...stateGamaItem,
        etis: [
          ...state.gamaItem.etis,
          {
            pointOfUseCode,
            etiNo,
            componentNo,
            effectiveTime: new Date()
          }
        ]
      }
      setState({
        ...state,
        gamaState: state.gamaState.map((item) =>
          item.componentNo === gamaItem.componentNo && item.pointOfUseCode === gamaItem.pointOfUseCode
            ? gamaItem
            : item
        ),
        gamaItem
      })
    }
  }

  // Actualiza la referencia del manejador cada vez que cambia
  useEffect(() => {
    etiUsedHandlerRef.current = handleOnEtiRemoved
  }, [state])

  // Inicializa SignalR y focus
  useEffect(() => {
    const onFocus = (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        e.target.select()
      }
    }

    document.addEventListener('focus', onFocus, true)

    const signalRClient = getSignalRClient(
      'ETI Movements SignalR Client',
      'http://mxsrvapps/gtt/services/etimovements/hubs/etimovements'
    )
      .on('EtiUsed', (lineCode, etiNo, componentNo, pointOfUseCode) => {
        const eti = { etiNo, pointOfUseCode, componentNo }
        console.log('EtiUsed', eti)
        etiUsedHandlerRef.current(eti)
      })
      signalRClient.start()

    return () => {
      document.removeEventListener('focus', onFocus)
      signalRClient?.stop?.() // limpieza segura
    }
  }, [])

  return (
<>
  <ErrorOverlay />
  <div className="h-screen bg-slate-900 text-white flex flex-col">
    {/* Header */}
    <header className="px-6 py-4 bg-slate-900 text-orange-400 text-2xl font-bold border-b border-white/10">
    Carga de Materiales
    </header>

    {/* Contenido principal en 3 columnas */}
    <main className="flex flex-1 overflow-hidden">
      {/* Columna 1 */}
<section className="h-full w-full md:w-1/4 p-4 overflow-y-auto overflow-x-hidden flex flex-col gap-1 bg-white/5 border-r border-white/10">
  <LineSearch lineFilterRef={lineFilterRef} onLineChanged={handleOnLineChanged} />
  <PartSelection
    line={state.line}
    selectedWorkOrderCode={state.workOrder.code}
    onWorkOrderChanged={handleOnWorkOrderChanged}
  />
  <EtiLoad
    etiNoRef={etiNoRef}
    pointOfUseRef={pointOfUseRef}
    selectedLineCode={state.line.code}
    selectedPartNo={state.workOrder.partNo}
    selectedWorkOrderCode={state.workOrder.code}
    onEtiAdded={handleOnEtiAdded}
  />
</section>


      {/* Columna 2 */}
      <section className="w-full max-w-full md:w-1/3 p-4 overflow-y-auto bg-white/5 border-r border-white/10">
        <GamaState
          gamaState={state.gamaState}
          lineCode={state.line.code}
          partNo={state.workOrder.partNo}
          onGamaItemSelected={handleOnGamaItemSelected}
          onGamaState={handleGamaState}
          activeItem={state.gamaItem}
        />
      </section>

      {/* Columna 3 */}
      <section className="w-full md:w-1/3 p-4 overflow-y-auto bg-white/5">
        <LoadedEtis
          line={state.line}
          gamaItem={state.gamaItem}
          onEtiRemoved={handleOnEtiRemoved}
        />
      </section>
    </main>
  </div>
</>

  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
export default App
