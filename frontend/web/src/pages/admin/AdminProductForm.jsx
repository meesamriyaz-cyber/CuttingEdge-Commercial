import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  fetchProduct,
} from "../../api/adminProducts";

export default function AdminProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    segment: "CONSUMER",
    category: ""
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  // load product when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    async function loadProduct() {
      try {
        const data = await fetchProduct(id);

        // ensure we don't lose missing fields
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          sku: data.sku || "",
          segment: data.segment || "CONSUMER",
          category: data.category || "",
        });

        // Load existing images for editing
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [isEdit, id]);

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setIsProcessingImages(true);

    try {
      const base64List = await Promise.all(files.map((file) => toBase64(file)));

      // Add new images to existing ones
      setPreview((prev) => [...prev, ...base64List]);
      setImageFiles((prev) => [...prev, ...base64List]);
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Failed to process images");
    } finally {
      setIsProcessingImages(false);
    }
  }

  // Remove image from preview and files
  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setPreview(newPreview);
    setImageFiles(newImageFiles);
  };

  // Remove existing image (for edit mode)
  const removeExistingImage = (publicId) => {
    const newExistingImages = existingImages.filter(
      (img) => img.publicId !== publicId
    );
    setExistingImages(newExistingImages);
  };

  // Count total images
  const totalImagesCount = () => {
    return existingImages.length + preview.length;
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent submission if images are still being processed
    if (isProcessingImages) {
      setError("Please wait for images to finish processing");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      ...form,
      images: imageFiles, // base64 list for new images
      existingImages: existingImages, // existing images for edit mode
    };
    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        {isEdit ? "Edit Product" : "Create Product"}
      </h2>

      {error && (
        <div className="border border-red-300 bg-red-50 p-2 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 rounded-md border"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded px-3 py-2"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU Code"
            className="w-full border rounded px-3 py-2"
          />
        </div>
          <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Category</option>
          <option value="Networking">Networking</option>
          <option value="Computers">Computers</option>
          <option value="Printers">Printers</option>
          <option value="Accessories">IT Accessories</option>
          <option value="Accessories">Electronic Appliances</option>
        </select>

        {/* Allow selecting segment only when creating */}
        <select
          name="segment"
          value={form.segment}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          disabled={isEdit} // 🔒 prevent accidental segment mismatch
          required
        >
          <option value="CONSUMER">Consumer (Private Users)</option>
          <option value="COMMERCIAL">Commercial (Govt Users)</option>
        </select>

        {isEdit && (
          <p className="text-xs text-slate-500">
            Product segment cannot be changed after creation.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={saving || isProcessingImages}
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving…"
              : isProcessingImages
              ? "Processing Images..."
              : isEdit
              ? "Save Changes"
              : "Create Product"}
          </button>
        </div>
        <div>
          <label className="text-xs text-slate-600">Product Images</label>

          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={isProcessingImages}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {isProcessingImages && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Processing images...
                </div>
              )}
            </div>

            {/* Existing Images (Edit Mode) */}
            {isEdit && existingImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Existing Images
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((image, index) => (
                    <div key={image.publicId} className="relative group">
                      <img
                        src={image.url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeExistingImage(image.publicId)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {preview.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  New Images
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {preview.map((img, i) => (
                    <div key={`new-${i}`} className="relative group">
                      <img
                        src={img}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Info */}
            <div className="text-xs text-slate-500">
              {totalImagesCount()} image{totalImagesCount() !== 1 ? "s" : ""}{" "}
              total
              {totalImagesCount() > 0 && (
                <span className="ml-2 text-blue-600">
                  ({existingImages.length} existing, {preview.length} new)
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
