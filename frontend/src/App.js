import React, { useState, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { ArrowLeftRight, ZoomIn, ZoomOut, Upload, ArrowRight, Zap, Maximize, BarChart2, Layers } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

import './index.css'

const zoomLevels = [2, 4, 8, 16, 32]

const LandingPage = ({ setActiveTab }) => {
  const [landingSliderValue, setLandingSliderValue] = useState(50)

  const handleLandingSliderChange = (e) => {
    setLandingSliderValue(Number(e.target.value))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt="Centaurion Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold">Centaurion Slidr</span>
          </div>
          <Button variant="ghost">Sign Up</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Enhance Your Images with AI</h1>
          <p className="text-xl text-gray-600 mb-8">Experience the power of AI-driven image upscaling with Centaurion Slidr</p>
          <Button className="text-lg px-8 py-6" onClick={() => setActiveTab("app")}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        <section className="mb-16">
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/placeholder.svg?height=400&width=800"
              alt="Original"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: `inset(0 ${100 - landingSliderValue}% 0 0)`,
              }}
            >
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="Upscaled"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={landingSliderValue}
              onChange={handleLandingSliderChange}
              className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-1 bg-white rounded-full shadow-md pointer-events-none" />
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Zap, title: 'AI Upscaling', description: 'Powered by Real-ESRGAN for stunning results' },
            { icon: Maximize, title: 'Magnifier Tool', description: 'Zoom in up to 32x with logarithmic scaling' },
            { icon: BarChart2, title: 'Quality Analysis', description: 'Compare histograms, PSNR, SSIM, and more' },
            { icon: Layers, title: 'Slider Comparison', description: 'Easily compare original and upscaled images' },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to enhance your images?</h2>
          <Button className="text-lg px-8 py-6" onClick={() => setActiveTab("app")}>
            Try Centaurion Slidr Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; 2023 Centaurion Slidr. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

const ImageComparison = ({ images }) => {
  const [sliderValue, setSliderValue] = useState(50)
  const [zoomIndex, setZoomIndex] = useState(0)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleSliderChange = (value) => {
    setSliderValue(value[0])
  }

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, zoomLevels.length - 1))
  }

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMagnifierPosition({ x, y })
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  React.useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false)
    window.addEventListener('mouseup', handleMouseUpGlobal)
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal)
  }, [])

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentImageIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Comparison</CardTitle>
        <CardDescription>Compare the original and upscaled images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] mb-4"
             onMouseMove={handleMouseMove}
             onMouseDown={handleMouseDown}
             onMouseUp={handleMouseUp}>
          <img
            src={currentImage.original}
            alt="Original"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
            }}
          >
            <img
              src={currentImage.upscaled}
              alt="Upscaled"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute top-0 left-0 w-1 h-full bg-white shadow-md"
            style={{ left: `${sliderValue}%` }}
          />
          <ArrowLeftRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
          {isDragging && (
            <div
              className="absolute w-32 h-32 border-2 border-white rounded-full overflow-hidden shadow-lg"
              style={{
                left: magnifierPosition.x - 64,
                top: magnifierPosition.y - 64,
                pointerEvents: 'none',
              }}
            >
              <img
                src={currentImage.original}
                alt="Magnified Original"
                className="absolute w-[800px] h-[500px] object-cover"
                style={{
                  left: -magnifierPosition.x * zoomLevels[zoomIndex] + 64,
                  top: -magnifierPosition.y * zoomLevels[zoomIndex] + 64,
                  transform: `scale(${zoomLevels[zoomIndex]})`,
                  transformOrigin: 'top left',
                }}
              />
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
                }}
              >
                <img
                  src={currentImage.upscaled}
                  alt="Magnified Upscaled"
                  className="absolute w-[800px] h-[500px] object-cover"
                  style={{
                    left: -magnifierPosition.x * zoomLevels[zoomIndex] + 64,
                    top: -magnifierPosition.y * zoomLevels[zoomIndex] + 64,
                    transform: `scale(${zoomLevels[zoomIndex]})`,
                    transformOrigin: 'top left',
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomIndex === 0}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="w-[calc(100%-5rem)]"
          />
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomIndex === zoomLevels.length - 1}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={handlePrevImage} disabled={images.length <= 1}>Previous Image</Button>
          <Button onClick={handleNextImage} disabled={images.length <= 1}>Next Image</Button>
        </div>
      </CardContent>
    </Card>
  )
}

const ImageAnalysis = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentImageIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Analysis</CardTitle>
        <CardDescription>Compare quality metrics between original and upscaled images</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="histogram">
          <TabsList className="mb-4">
            <TabsTrigger value="histogram">Histogram</TabsTrigger>
            <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="histogram">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentImage.analysis.histogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="original" fill="#8884d8" name="Original" />
                <Bar dataKey="upscaled" fill="#82ca9d" name="Upscaled" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="metrics">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[currentImage.analysis]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="psnr" name="PSNR" stroke="#8884d8" />
                <Line type="monotone" dataKey="ssim" name="SSIM" stroke="#82ca9d" />
                <Line type="monotone" dataKey="edge_quality" name="Edge Quality" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between mt-4">
          <Button onClick={handlePrevImage} disabled={images.length <= 1}>Previous Image</Button>
          <Button onClick={handleNextImage} disabled={images.length <= 1}>Next Image</Button>
        </div>
      </CardContent>
    </Card>
  )
}

const AppUI = () => {
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    try {
      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadResponse.json()

      const upscaleResponse = await fetch('http://localhost:5000/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filenames: uploadData.filenames }),
      })
      const upscaleData = await upscaleResponse.json()

      const analyzeResponse = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_filenames: uploadData.filenames,
          upscaled_filenames: upscaleData.upscaled_filenames,
        }),
      })
      const analyzeData = await analyzeResponse.json()

      const newImages = analyzeData.map((item) => ({
        original: `http://localhost:5000/image/${item.original_filename}`,
        upscaled: `http://localhost:5000/image/${item.upscaled_filename}`,
        analysis: item.analysis,
      }))

      setImages(newImages)
    } catch (error) {
      console.error('Error processing images:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Centaurion Slidr</h1>
        <p className="text-xl text-gray-600">AI-Powered Image Upscaling and Analysis</p>
      </header>

      <main className="space-y-8">
        {images.length > 0 && (
          <>
            <ImageComparison images={images} />
            <ImageAnalysis images={images} />
          </>
        )}
        <Card>
          <CardContent className="flex justify-center py-6">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button size="lg" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload Images
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

const CentaurionSlidrCombined = () => {
  const [activeTab, setActiveTab] = useState("landing")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="landing">Landing Page</TabsTrigger>
        <TabsTrigger value="app">App UI</TabsTrigger>
      </TabsList>
      <TabsContent value="landing">
        <LandingPage setActiveTab={setActiveTab} />
      </TabsContent>
      <TabsContent value="app">
        <AppUI />
      </TabsContent>
    </Tabs>
  )
}

export default CentaurionSlidrCombined