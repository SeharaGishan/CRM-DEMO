export type DealStage =
  | "New"
  | "Contacted"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost";

export const DEAL_STAGES: DealStage[] = [
  "New",
  "Contacted",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website: string;
  avatarColor: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  companyId: string;
  email: string;
  phone: string;
  tags: string[];
  avatarColor: string;
  source: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: DealStage;
  owner: string;
  closeDate: string;
  createdAt: string;
  stageChangedAt: string;
  productId?: string;
}

export type ActivityType = "call" | "email" | "meeting" | "note";

export interface Activity {
  id: string;
  contactId: string;
  dealId?: string;
  type: ActivityType;
  title: string;
  body: string;
  timestamp: string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "done";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  contactId?: string;
  dealId?: string;
}

export type PaymentType = "advance" | "full" | "balance";
export type PaymentGateway = "PayHere" | "Stripe" | "PayPal";

export interface Receipt {
  id: string;
  receiptNumber: string;
  dealId: string;
  amount: number;
  type: PaymentType;
  gateway: PaymentGateway;
  customerName: string;
  date: string;
}

export type PaymentLinkStatus = "pending" | "paid" | "expired";

export interface PaymentLink {
  id: string;
  dealId: string;
  type: PaymentType;
  amount: number;
  gateway: PaymentGateway;
  url: string;
  status: PaymentLinkStatus;
  createdAt: string;
}

export type SalePaymentStatus = "Unpaid" | "Advance Paid" | "Paid in Full";

export type EmployeeDepartment = "Sales" | "Support" | "Management";
export const EMPLOYEE_DEPARTMENTS: EmployeeDepartment[] = ["Sales", "Support", "Management"];

export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: EmployeeDepartment;
  email: string;
  phone: string;
  avatarColor: string;
  status: EmployeeStatus;
  joinedAt: string;
}

export type ProductCategory = "Software License" | "Service Package" | "Support Plan" | "Hardware";
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Software License",
  "Service Package",
  "Support Plan",
  "Hardware",
];

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  createdAt: string;
}

export function stockStatus(product: Pick<Product, "stockQuantity" | "reorderLevel">): StockStatus {
  if (product.stockQuantity <= 0) return "Out of Stock";
  if (product.stockQuantity <= product.reorderLevel) return "Low Stock";
  return "In Stock";
}
