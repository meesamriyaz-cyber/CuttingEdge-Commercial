import genuineProductsImage from "../assets/images/genuine-products.jpg";
import hpImage from "../assets/images/hp.jpg";
import hpPrinterImage from "../assets/images/hp-2606.jpg";
import lenovoImage from "../assets/images/lenovo.png";
import microtekImage from "../assets/images/microtek.png";
import officeNetworkImage from "../assets/images/office-network.jpg";

export function getImageUrl(image) {
  if (typeof image === "string") return image.trim();
  if (typeof image?.url === "string") return image.url.trim();
  if (typeof image?.secure_url === "string") return image.secure_url.trim();
  if (typeof image?.src === "string") return image.src.trim();
  return "";
}

export function getProductImages(product) {
  const images = Array.isArray(product?.images)
    ? product.images
    : [product?.images].filter(Boolean);

  return images.map(getImageUrl).filter(Boolean);
}

export function getCategoryFallbackImage(name = "") {
  const value = name.toLowerCase();

  if (value.includes("printer")) return hpPrinterImage;
  if (value.includes("network") || value.includes("server")) return officeNetworkImage;
  if (value.includes("laptop") || value.includes("computer") || value.includes("desktop")) {
    return hpImage;
  }
  if (value.includes("storage") || value.includes("accessor")) return lenovoImage;
  if (value.includes("electronic") || value.includes("appliance") || value.includes("power")) {
    return microtekImage;
  }

  return genuineProductsImage;
}

export function getProductPrimaryImage(product) {
  return (
    getProductImages(product)[0] ||
    getCategoryFallbackImage(product?.category || product?.name || "")
  );
}
