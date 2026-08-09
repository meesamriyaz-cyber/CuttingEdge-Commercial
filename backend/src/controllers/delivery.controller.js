import {
  isServiceablePincode,
  getDistanceForPincode,
  calculateDeliveryCharge,
} from "../utils/delivery.js";

export const checkDelivery = async (req, res) => {
  try {
    const { pincode, orderTotal } = req.body;

    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    const serviceable = isServiceablePincode(pincode);

    if (!serviceable) {
      return res.status(200).json({
        serviceable: false,
        message: "Sorry, we do not deliver to this pincode yet. We currently serve Kashmir Division only.",
      });
    }

    const distanceKm = getDistanceForPincode(pincode);
    const deliveryCharge = calculateDeliveryCharge(distanceKm, orderTotal || 0);

    return res.status(200).json({
      serviceable: true,
      distanceKm,
      deliveryCharge,
      freeDeliveryThreshold: 1000,
      message: deliveryCharge === 0
        ? "Free delivery applicable"
        : `Delivery charge: ₹${deliveryCharge}`,
    });
  } catch (err) {
    console.error("Check delivery error:", err);
    return res.status(500).json({ message: "Could not check delivery availability" });
  }
};
