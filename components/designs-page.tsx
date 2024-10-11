"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { designs as initialDesigns } from '@/data/designs'
import { users } from '@/data/users'
import { orders } from '@/data/orders'
import FixedActionBar from '@/components/fixed-action-bar'

const DesignsPage = () => {
  const [designs, setDesigns] = useState(initialDesigns)
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([])
  const [showAddToOrderModal, setShowAddToOrderModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('active')
  const [labelFilter, setLabelFilter] = useState('all')

  const toggleDesignSelection = (id: number, status: string) => {
    if (status.toLowerCase() === 'invalid') return
    setSelectedDesigns(prev =>
      prev.includes(id) ? prev.filter(designId => designId !== id) : [...prev, id]
    )
  }

  const handleArchiveDesigns = () => {
    const updatedDesigns = designs.map(design =>
      selectedDesigns.includes(design.id) ? { ...design, status: 'Archived' } : design
    )
    setDesigns(updatedDesigns)
    setSelectedDesigns([])
    console.log(`${selectedDesigns.length} design(s) have been archived.`)
  }

  const handleUnarchiveDesigns = () => {
    const updatedDesigns = designs.map(design =>
      selectedDesigns.includes(design.id) ? { ...design, status: 'Active' } : design
    )
    setDesigns(updatedDesigns)
    setSelectedDesigns([])
    console.log(`${selectedDesigns.length} design(s) have been unarchived.`)
  }

  const draftOrders = orders.filter(order => order.status === 'DRAFT' || order.status === 'NEW CUSTOMER DRAFT')

  const uniqueLabels = useMemo(() => {
    const labels = new Set(designs.map(design => design.label))
    return ['all', ...Array.from(labels)]
  }, [designs])

  const filteredDesigns = useMemo(() => {
    return designs.filter(design => {
      const statusMatch = design.status.toLowerCase() === statusFilter
      const labelMatch = labelFilter === 'all' || design.label === labelFilter
      return statusMatch && labelMatch
    })
  }, [designs, statusFilter, labelFilter])

  const isArchived = statusFilter === 'archived'

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">Designs</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Button 
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'archived' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('archived')}
          >
            Archived
          </Button>
          <Button 
            variant={statusFilter === 'invalid' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('invalid')}
          >
            Invalid
          </Button>
        </div>
        <Select value={labelFilter} onValueChange={setLabelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Label" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLabels.map((label) => (
              <SelectItem key={label} value={label}>
                {label === 'all' ? 'All Labels' : label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredDesigns.map((design) => (
          <Card 
            key={design.id} 
            className={`cursor-pointer relative ${selectedDesigns.includes(design.id) ? 'ring-2 ring-primary' : ''} ${design.status.toLowerCase() === 'invalid' ? 'opacity-50' : ''}`}
          >
            <div className="absolute top-2 right-2 z-10">
              <Checkbox
                checked={selectedDesigns.includes(design.id)}
                onCheckedChange={() => toggleDesignSelection(design.id, design.status)}
                onClick={(e) => e.stopPropagation()}
                disabled={design.status.toLowerCase() === 'invalid'}
              />
            </div>
            <CardContent className="p-4" onClick={() => toggleDesignSelection(design.id, design.status)}>
              <div className="aspect-square bg-gray-200 mb-2 flex items-center justify-center text-gray-500">
                {design.name}
              </div>
              <h3 className="font-semibold text-sm truncate">{design.name}</h3>
              <p className="text-xs text-gray-600">{design.gender}</p>
              <p className="text-xs text-gray-600">Created by: {users.find(u => u.id === design.createdById)?.name}</p>
              <p className="text-xs text-gray-600">Date: {design.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedDesigns.length > 0 && (
        <FixedActionBar>
          <div className="flex items-center space-x-4">
            <p>{selectedDesigns.length} design(s) selected</p>
            {!isArchived && (
              <>
                <Button variant="secondary" onClick={() => setShowAddToOrderModal(true)}>
                  Add to Order
                </Button>
                <Button variant="secondary" onClick={() => console.log("Sharing designs")}>
                  Share Design(s)
                </Button>
                <Button variant="secondary" onClick={handleArchiveDesigns}>
                  Archive Design(s)
                </Button>
              </>
            )}
            {isArchived && (
              <Button variant="secondary" onClick={handleUnarchiveDesigns}>
                Unarchive Design(s)
              </Button>
            )}
          </div>
        </FixedActionBar>
      )}
      <Dialog open={showAddToOrderModal} onOpenChange={setShowAddToOrderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">Start a New Order</h3>
              <Button onClick={() => {
                console.log("Starting a new order. This feature is not fully implemented yet.")
                setShowAddToOrderModal(false)
              }}>
                Create New Order
              </Button>
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">Add to Existing Order</h3>
              <Select onValueChange={(value) => {
                console.log(`Designs added to order ${value}. This feature is not fully implemented yet.`)
                setShowAddToOrderModal(false)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {draftOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id.toString()}>{order.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DesignsPage