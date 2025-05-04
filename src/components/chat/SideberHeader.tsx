"use client"

import type React from "react"

import { SidebarHeaderProps } from "@/types"

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ activeSection, setActiveSection, constraintsCount }) => {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md cursor-pointer ${
          activeSection === "overview" ? "bg-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveSection("overview")}
      >
        Overview
      </button>
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md relative cursor-pointer ${
          activeSection === "constraints" ? "bg-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveSection("constraints")}
      >
        Constraints
        {constraintsCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-gray-200">
            {constraintsCount}
          </span>
        )}
      </button>
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md cursor-pointer ${
          activeSection === "objectives" ? "bg-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveSection("objectives")}
      >
        Objectives
      </button>
    </div>
  )
}

export default SidebarHeader