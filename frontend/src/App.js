import React, { useState, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { ArrowLeftRight, ZoomIn, ZoomOut, Upload, ArrowRight, Zap, Maximize, BarChart2, Layers } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './index.css'

const zoomLevels = [2, 4, 8, 16, 32]
const BACKEND_URL = window.location.protocol + '//' + window.location.hostname.replace('3000', '5000')
console.log('Backend URL:', BACKEND_URL)

// ... Rest of the component definitions remain the same until AppUI ...

const AppUI = () => {
  const [images, setImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    try {
      console.log('Sending upload request to:', `${BACKEND_URL}/upload`)
      const uploadResponse = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        throw new Error(`Upload failed: ${errorText}`)
      }
      
      const uploadData = await uploadResponse.json()
      console.log('Upload successful:', uploadData)

      const upscaleResponse = await fetch(`${BACKEND_URL}/upscale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ filenames: uploadData.filenames }),
      })

      if (!upscaleResponse.ok) {
        const errorText = await upscaleResponse.text()
        throw new Error(`Upscale failed: ${errorText}`)
      }

      const upscaleData = await upscaleResponse.json()
      console.log('Upscale successful:', upscaleData)

      const analyzeResponse = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          original_filenames: uploadData.filenames,
          upscaled_filenames: upscaleData.upscaled_filenames,
        }),
      })

      if (!analyzeResponse.ok) {
        const errorText = await analyzeResponse.text()
        throw new Error(`Analysis failed: ${errorText}`)
      }

      const analyzeData = await analyzeResponse.json()
      console.log('Analysis successful:', analyzeData)

      const newImages = analyzeData.map((item) => ({
        original: `${BACKEND_URL}/image/${item.original_filename}`,
        upscaled: `${BACKEND_URL}/image/${item.upscaled_filename}`,
        analysis: item.analysis,
      }))

      setImages(newImages)
      setCurrentImageIndex(0)
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images: ' + error.message)
    }
  }

  // ... Rest of the AppUI component remains the same ...
