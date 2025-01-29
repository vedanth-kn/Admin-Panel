import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@heroui/react";
import { Pencil, Trash2 } from 'lucide-react';

const voucherDetailsDialog = ({ 
  isOpen, 
  setIsOpen, 
  voucher, 
  onEdit, 
  onDelete 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState(voucher);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (editFormData[key] !== null) {
          data.append(key, editFormData[key]);
        }
      });

      const response = await fetch(`/api/vouchers/${voucher.id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to update voucher');
      }

      onEdit();
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating voucher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/vouchers/${voucher.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete voucher');
        }

        onDelete();
        setIsOpen(false);
      } catch (error) {
        console.error('Error deleting voucher:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh] z-50">
          {/* Header */}
          <div className="p-6 border-b">
            <Dialog.Title className="flex justify-between items-center">
              <span className="text-xl font-bold">{isEditMode ? 'Edit voucher' : 'voucher Details'}</span>
              
            </Dialog.Title>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isEditMode ? (
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <input
                    type="url"
                    value={editFormData.website_url}
                    onChange={(e) => setEditFormData({...editFormData, website_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business Category</label>
                  <input
                    type="text"
                    value={editFormData.business_category}
                    onChange={(e) => setEditFormData({...editFormData, business_category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setEditFormData({...editFormData, image: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    accept="image/*"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white rounded-lg hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{voucher.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{voucher.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Website</h3>
                  <a
                    href={voucher.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {voucher.website_url}
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold">Business Category</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {voucher.business_category}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Pencil size={16} />
                  {isEditMode ? 'Cancel Edit' : 'Edit'}
                </Button>
                <Button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>

          {/* Footer */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default voucherDetailsDialog;