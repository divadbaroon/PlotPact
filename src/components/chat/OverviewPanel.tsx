"use client"

import type React from "react"
import Image from "next/image"

import { OverviewPanelProps } from "@/types"

const OverviewPanel: React.FC<OverviewPanelProps> = ({ title, plot, image }) => {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden h-48 w-full">
        {image ? (
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{title || "Untitled Story"}</h2>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">{plot || "No description available."}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium mb-2">Story Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-gray-500">Words</div>
            <div className="font-medium">0</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-gray-500">Paragraphs</div>
            <div className="font-medium">0</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPanel
