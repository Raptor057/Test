import React from 'react'

const GamaStateItem = ({ item, onGamaItemSelected, activeItem }) => {
  const quantity = item.etis.length

  const isActive =
    item.componentNo === activeItem.componentNo &&
    item.pointOfUseCode === activeItem.pointOfUseCode

  let className = ''
  if (quantity === 0) className = 'empty'
  else if (quantity > item.capacity) className = 'over'
  else if (quantity === item.capacity) className = 'full'
  else className = 'partial'

  if (isActive) className += ' active'

  return (
    <tr className={className} onClick={() => onGamaItemSelected(item)}>
      <td>{item.pointOfUseCode}</td>
      <td>{item.componentNo}</td>
      <td>{quantity} / {item.capacity}</td>
    </tr>
  )
}

export default GamaStateItem
