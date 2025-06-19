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
      <div>
        <LineSearch lineFilterRef={lineFilterRef} onLineChanged={handleOnLineChanged} />
        <PartSelection
          line={state.line}
          selectedWorkOrderCode={state.workOrder.code}
          onWorkOrderChanged={handleOnWorkOrderChanged}
        />
        <hr />
        <EtiLoad
          etiNoRef={etiNoRef}
          pointOfUseRef={pointOfUseRef}
          selectedLineCode={state.line.code}
          selectedPartNo={state.workOrder.partNo}
          selectedWorkOrderCode={state.workOrder.code}
          onEtiAdded={handleOnEtiAdded}
        />
      </div>
      <GamaState
        gamaState={state.gamaState}
        lineCode={state.line.code}
        partNo={state.workOrder.partNo}
        onGamaItemSelected={handleOnGamaItemSelected}
        onGamaState={handleGamaState}
        activeItem={state.gamaItem}
      />
      <LoadedEtis
        line={state.line}
        gamaItem={state.gamaItem}
        onEtiRemoved={handleOnEtiRemoved}
      />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
export default App
