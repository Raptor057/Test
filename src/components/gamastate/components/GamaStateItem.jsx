import React from 'react'

const GamaStateItem = ({ item, onGamaItemSelected, activeItem }) => {
  const quantity = item.etis.length
  const capacity = item.capacity

  const isActive =
    item.componentNo === activeItem.componentNo &&
    item.pointOfUseCode === activeItem.pointOfUseCode

  // Aplica color basado en cantidad
  const baseColor = (() => {
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity < capacity) return 'bg-blue-100 text-blue-800'
    if (quantity === capacity) return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  })()

  const rowClass = `
    cursor-pointer
    ${baseColor}
    ${isActive ? 'ring-2 ring-white' : ''}
  `

  return (
    <tr
      className={rowClass}
      onClick={() => onGamaItemSelected(item)}
    >
      <td className="px-3 py-2">{item.pointOfUseCode}</td>
      <td className="px-3 py-2">{item.componentNo}</td>
      <td className="px-3 py-2 text-center">{quantity} / {capacity}</td>
    </tr>
  )
}

export default GamaStateItem
