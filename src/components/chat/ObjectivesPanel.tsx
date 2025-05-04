"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"

import { ObjectivesPanelProps } from "@/types"

const ObjectivesPanel: React.FC<ObjectivesPanelProps> = ({
  objectives,
  onToggleObjective,
  onDeleteObjective,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Your Objectives</h3>

        {objectives.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-md">
            No objectives yet. Add some to guide your writing!
          </div>
        ) : (
          <div className="space-y-2">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md group"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`objective-${objective.id}`}
                    checked={objective.completed}
                    onCheckedChange={() => onToggleObjective(objective.id)}
                  />
                  <label
                    htmlFor={`objective-${objective.id}`}
                    className={`text-sm ${objective.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                  >
                    {objective.description}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteObjective(objective.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium mb-2">Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{
              width: `${
                objectives.length > 0
                  ? Math.round((objectives.filter((o) => o.completed).length / objectives.length) * 100)
                  : 0
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {objectives.filter((o) => o.completed).length} of {objectives.length} objectives completed
        </p>
      </div>
    </div>
  )
}

export default ObjectivesPanel
