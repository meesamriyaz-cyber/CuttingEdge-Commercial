import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/Product.js";
import cloudinary from "../src/utils/cloudinary.js";

const APPLY = process.argv.includes("--apply");
const MAX_DELTA_MS = 75 * 1000;

const loadCloudinaryResources = async () => {
  const resources = [];
  let nextCursor;

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "products/",
      max_results: 500,
      next_cursor: nextCursor,
    });

    resources.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return resources
    .map((resource) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      createdAt: new Date(resource.created_at),
      width: resource.width,
      height: resource.height,
    }))
    .filter((resource) => resource.publicId && resource.url)
    .sort((a, b) => a.createdAt - b.createdAt);
};

const assignResourcesToProducts = (products, resources) => {
  const assignments = new Map(
    products.map((product) => [String(product._id), []]),
  );

  for (const resource of resources) {
    let closestProduct;
    let closestDelta = Infinity;

    for (const product of products) {
      const delta = Math.abs(
        resource.createdAt.getTime() - new Date(product.createdAt).getTime(),
      );

      if (delta < closestDelta) {
        closestDelta = delta;
        closestProduct = product;
      }
    }

    if (closestProduct && closestDelta <= MAX_DELTA_MS) {
      assignments.get(String(closestProduct._id)).push({
        url: resource.url,
        publicId: resource.publicId,
      });
    }
  }

  return assignments;
};

const main = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const products = await Product.find({})
    .select("name category images createdAt updatedAt")
    .sort({ createdAt: 1 });
  const resources = await loadCloudinaryResources();
  const assignments = assignResourcesToProducts(products, resources);
  const missingProducts = products.filter(
    (product) => !Array.isArray(product.images) || product.images.length === 0,
  );

  const recoverable = missingProducts
    .map((product) => ({
      product,
      images: assignments.get(String(product._id)) || [],
    }))
    .filter((entry) => entry.images.length > 0);

  const report = {
    mode: APPLY ? "apply" : "dry-run",
    cloudinaryResources: resources.length,
    missingProducts: missingProducts.length,
    recoverableProducts: recoverable.length,
    recoveredImages: recoverable.reduce(
      (total, entry) => total + entry.images.length,
      0,
    ),
    products: recoverable.map(({ product, images }) => ({
      id: String(product._id),
      name: product.name,
      category: product.category,
      createdAt: product.createdAt,
      imageCount: images.length,
      publicIds: images.map((image) => image.publicId),
    })),
  };

  if (APPLY) {
    for (const { product, images } of recoverable) {
      await Product.updateOne(
        {
          _id: product._id,
          $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
        },
        { $set: { images } },
      );
    }
  }

  console.log(JSON.stringify(report, null, 2));

  await mongoose.disconnect();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
