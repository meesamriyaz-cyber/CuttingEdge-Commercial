import User from "../models/User.js";

// Get all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, pincode, phone, isDefault } = req.body;

    // Validate required fields
    if (!label || !street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize addresses array if not exists
    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is the first address or isDefault is true, handle default logic
    if (isDefault || user.addresses.length === 0) {
      // Unset any existing default
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Create new address
    const newAddress = {
      label,
      street,
      city,
      state,
      pincode,
      phone,
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    // Get the newly added address (last in array)
    const addedAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      message: "Address added successfully",
      address: addedAddress,
    });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update existing address by ID
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, street, city, state, pincode, phone, isDefault } = req.body;

    // Validate required fields
    if (!label || !street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address
    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting as default, unset other defaults
    if (isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    address.label = label;
    address.street = street;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.phone = phone;
    address.isDefault = isDefault || address.isDefault;

    await user.save();

    res.json({
      message: "Address updated successfully",
      address,
    });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete address by ID
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address
    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = address.isDefault;

    // Remove the address
    user.addresses.pull(id);

    // If the deleted address was default, set the first remaining as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Set an address as default
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address
    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Unset all defaults and set this one as default
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
    address.isDefault = true;

    await user.save();

    res.json({
      message: "Default address set successfully",
      address,
    });
  } catch (err) {
    console.error("Set default address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
