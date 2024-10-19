import React from 'react'

export function Card({ children, ...props }) {
  return <div className="bg-white shadow-md rounded-lg" {...props}>{children}</div>
}

export function CardContent({ children, ...props }) {
  return <div className="p-4" {...props}>{children}</div>
}

export function CardDescription({ children, ...props }) {
  return <p className="text-gray-600" {...props}>{children}</p>
}

export function CardHeader({ children, ...props }) {
  return <div className="p-4 border-b" {...props}>{children}</div>
}

export function CardTitle({ children, ...props }) {
  return <h2 className="text-xl font-bold" {...props}>{children}</h2>
}
