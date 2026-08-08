import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();


/*const isProduction = process.env.NODE_ENV === "production";
const keyId = isProduction
  ? process.env.RAZORPAY_KEY_ID_LIVE
  : process.env.RAZORPAY_KEY_ID_TEST;
const keySecret = isProduction
  ? process.env.RAZORPAY_KEY_SECRET_LIVE
  : process.env.RAZORPAY_KEY_SECRET_TEST;
*/

const isProduction = process.env.NODE_ENV === "production";
const keyId = isProduction
  ? process.env.RAZORPAY_KEY_ID_PROD || process.env.RAZORPAY_KEY_ID_TEST
  : process.env.RAZORPAY_KEY_ID_TEST;
const keySecret = isProduction
  ? process.env.RAZORPAY_KEY_SECRET_PROD || process.env.RAZORPAY_KEY_SECRET_TEST
  : process.env.RAZORPAY_KEY_SECRET_TEST;
if (!keyId || !keySecret) {
  throw new Error(
    `Razorpay ${isProduction ? "production" : "test"} keys not configured`,
  );
}

export const instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

// Utility function to verify payment signature
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const sign = orderId + "|" + paymentId;
  const expectedSign = crypto
    .createHmac("sha256", keySecret)
    .update(sign.toString())
    .digest("hex");

  return expectedSign === signature;
};

// Get current Razorpay key ID for frontend
export const getRazorpayKey = () => {
  return keyId;
};
