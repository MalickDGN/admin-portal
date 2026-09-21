import { createResourceService } from "./createResource";
import type { Product } from "@/types/entities";
import { mockProducts } from "@features/ecommerce/products/products.mock";

export type { Product };
export const productsService = createResourceService<Product>("products", mockProducts);
