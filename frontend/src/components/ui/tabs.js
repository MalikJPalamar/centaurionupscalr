import React from 'react'

export function Tabs({ value, onValueChange, children, ...props }) {
  return <div {...props}>{children}</div>
}

export function TabsContent({ value: tabValue, children, ...props }) {
  return <div role="tabpanel" hidden={props.value !== tabValue} {...props}>{children}</div>
}

export function TabsList({ children, ...props }) {
  return <div className="flex space-x-2 mb-4" role="tablist" {...props}>{children}</div>
}

export function TabsTrigger({ value: tabValue, children, ...props }) {
  const isSelected = props.value === tabValue
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      className={`px-4 py-2 rounded-md ${
        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
      onClick={() => props.onValueChange?.(tabValue)}
      {...props}
    >
      {children}
    </button>
  )
}
