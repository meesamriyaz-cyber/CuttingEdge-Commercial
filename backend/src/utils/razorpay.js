import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const prodKeyId = process.env.RAZORPAY_KEY_ID_PROD;
const prodKeySecret = process.env.RAZORPAY_KEY_SECRET_PROD;
const testKeyId = process.env.RAZORPAY_KEY_ID_TEST;
const testKeySecret = process.env.RAZORPAY_KEY_SECRET_TEST;

const hasValidProdKeys =
  prodKeyId && prodKeyId.startsWith("rzp_") && prodKeySecret;

const keyId = isProduction && hasValidProdKeys ? prodKeyId : testKeyId;
const keySecret = isProduction && hasValidProdKeys ? prodKeySecret : testKeySecret;

if (!keyId || !keySecret) {
  throw new Error(
    `Razorpay ${isProduction ? "production" : "test"} keys not configured`,
  );
}

export const instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const sign = orderId + "|" + paymentId;
  const expectedSign = crypto
    .createHmac("sha256", keySecret)
    .update(sign.toString())
    .digest("hex");

  return expectedSign === signature;
};

export const getRazorpayKey = () => keyId;
