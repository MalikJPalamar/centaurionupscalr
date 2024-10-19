import React from 'react'

export function Slider({ value, onValueChange, ...props }) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className="w-full"
      {...props}
    />
  )
}
