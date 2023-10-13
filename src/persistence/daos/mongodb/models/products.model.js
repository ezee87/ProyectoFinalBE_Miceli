import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Asegúrate de que esto esté presente y requerido
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: false }
});


productsSchema.plugin(mongoosePaginate);
export const ProductsModel = mongoose.model("products", productsSchema);