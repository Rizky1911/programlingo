'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variables: string[]
  onSubmit: (inputs: string) => void
}

export function InputDialog({ open, onOpenChange, variables, onSubmit }: InputDialogProps) {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(variables.map(v => [v, '']))
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const combinedInput = variables.map(v => inputs[v]).join('\n')
    onSubmit(combinedInput)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Enter Input Values</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {variables.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label htmlFor={variable} className="text-gray-700">
                {variable} =
              </Label>
              <Input
                id={variable}
                value={inputs[variable]}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  [variable]: e.target.value
                }))}
                className="bg-gray-50 border-gray-300 text-gray-900"
                placeholder="Enter value"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Run
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}