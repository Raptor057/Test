import React, { useEffect, useState } from 'react'
import materialLoadingApi from '../utils/MaterialLoadingApi'

const PartSelection = ({ line, selectedWorkOrderCode, onWorkOrderChanged }) => {
  const [workOrders, setWorkOrders] = useState([])

  const selectedWorkOrder = workOrders.find((w) => w.code === selectedWorkOrderCode)
    || { code: null, partNo: null, revision: null }

  const partNumbers = workOrders.filter(
    (value, index, self) =>
      self.findIndex((item) => item.partNo === value.partNo && item.revision === value.revision) === index
  )

  useEffect(() => {
    if (line.id) {
      materialLoadingApi.getLineWorkOrders(line.id, setWorkOrders)
    } else {
      setWorkOrders([])
    }
  }, [line])

  return (
    <div className="w-full max-w-full bg-white/10 text-white rounded p-4 shadow">
      <h3 className="text-lg font-semibold mb-4">Información de la Orden de Trabajo</h3>
      <table className="w-full max-w-full table-fixed border-separate border-spacing-y-2">
        <tbody>
          <tr>
            <td className="w-32 font-medium">Línea</td>
            <td>{line.code}</td>
          </tr>
          <tr>
            <td className="font-medium">Modelo</td>
            <td>
              <select
                value={selectedWorkOrder.code}
                onChange={(e) => {
                  const workOrder = workOrders.find((w) => w.code === e.target.value)
                  onWorkOrderChanged(workOrder)
                }}
                className="w-full max-w-full bg-white text-black px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {partNumbers.map((item, idx) => (
                  <option key={idx} value={item.code}>
                    {item.partNo} Rev {item.revision}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td className="font-medium">Cliente</td>
            <td>{selectedWorkOrder.client}</td>
          </tr>
          <tr>
            <td className="font-medium">Línea</td>
            <td>{selectedWorkOrder.line}</td>
          </tr>
          <tr>
            <td className="font-medium">Orden</td>
            <td>{selectedWorkOrder.order}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PartSelection
