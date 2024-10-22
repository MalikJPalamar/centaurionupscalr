import React, { useState, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { ArrowLeftRight, ZoomIn, ZoomOut, Upload, ArrowRight, Zap, Maximize, BarChart2, Layers } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

import './index.css'

const zoomLevels = [2, 4, 8, 16, 32]
const BACKEND_URL = 'http://localhost:5000';

// Rest of the file content remains the same
const LandingPage = ({ setActiveTab }) => {
  // ... existing code ...
}

// ... rest of the existing components and code ...

export default CentaurionSlidrCombined
