import React from 'react'

export function Tabs({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function TabsContent({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function TabsList({ children, ...props }) {
  return <div className="flex" {...props}>{children}</div>
}

export function TabsTrigger({ children, ...props }) {
  return <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300" {...props}>{children}</button>
}
