import { createResourceService } from "./createResource";
import type { Order } from "@/types/entities";
import { mockOrders } from "@features/ecommerce/orders/orders.mock";

export type { Order };
export const ordersService = createResourceService<Order>("orders", mockOrders);
