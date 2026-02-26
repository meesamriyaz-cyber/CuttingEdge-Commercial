import { useState, useEffect } from "react";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../api/addresses";

// Address Form Component
function AddressForm({ address, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        phone: address.phone || "",
        isDefault: address.isDefault || false,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-900">
        {address ? "Edit Address" : "Add New Address"}
      </h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label (e.g., Home, Office)
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Home"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <textarea
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="123 Main Street, Apartment 4B"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Mumbai"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Maharashtra"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="400001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="9876543210"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isDefault"
          id="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : address ? "Update Address" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Address Card Component
function AddressCard({ address, onEdit, onDelete, onSetDefault, loading }) {
  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all ${
        address.isDefault
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{address.label}</span>
          {address.isDefault && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(address)}
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(address._id)}
            disabled={loading}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {address.phone}
        </p>
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address._id)}
          disabled={loading}
          className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
        >
          Set as Default
        </button>
      )}
    </div>
  );
}

// Main AddressManager Component
export default function AddressManager({
  onSelectAddress,
  selectedAddressId,
  showSelector = false,
}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch addresses on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAddresses();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await addAddress(formData);
      await loadAddresses();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await updateAddress(editingAddress._id, formData);
      await loadAddresses();
      setEditingAddress(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setLoading(true);
    setError("");
    try {
      await setDefaultAddress(id);
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Failed to set default address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSelect = (address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Address List */}
      {!showForm && (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>No addresses saved yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div key={address._id} className="relative">
                  {showSelector && (
                    <div
                      onClick={() => handleSelect(address)}
                      className={`absolute inset-0 cursor-pointer rounded-lg border-2 transition-all ${
                        selectedAddressId === address._id
                          ? "border-indigo-500 bg-indigo-50/50"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    />
                  )}
                  <AddressCard
                    address={address}
                    onEdit={handleEdit}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                    loading={loading}
                  />
                  {showSelector && selectedAddressId === address._id && (
                    <div className="absolute top-2 right-2">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Address
          </button>
        </>
      )}

      {/* Address Form */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}
    </div>
  );
}
