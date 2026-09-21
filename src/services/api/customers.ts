import { createResourceService } from "./createResource";
import type { Customer } from "@/types/entities";
import { mockCustomers } from "@features/ecommerce/customers/customers.mock";

export type { Customer };
export const customersService = createResourceService<Customer>("customers", mockCustomers);
