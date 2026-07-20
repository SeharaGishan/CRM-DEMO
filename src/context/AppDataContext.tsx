"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { companies as seedCompanies } from "@/data/companies";
import { contacts as seedContacts } from "@/data/contacts";
import { deals as seedDeals } from "@/data/deals";
import { activities as seedActivities } from "@/data/activities";
import { tasks as seedTasks } from "@/data/tasks";
import { receipts as seedReceipts, paymentLinks as seedPaymentLinks } from "@/data/payments";
import { employees as seedEmployees } from "@/data/employees";
import { products as seedProducts } from "@/data/products";
import {
  Activity,
  Company,
  Contact,
  Deal,
  DealStage,
  Employee,
  PaymentGateway,
  PaymentLink,
  PaymentType,
  Product,
  Receipt,
  SalePaymentStatus,
  Task,
} from "@/lib/types";
import { useToast } from "@/context/ToastContext";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_KEY = "sharkonix-crm-demo-data-v1";

interface PersistedShape {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];
  receipts: Receipt[];
  paymentLinks: PaymentLink[];
  employees?: Employee[];
  companies?: Company[];
  products?: Product[];
}

function loadPersisted(): PersistedShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedShape) : null;
  } catch {
    return null;
  }
}

interface SaleInfo {
  deal: Deal;
  totalPaid: number;
  status: SalePaymentStatus;
  receipts: Receipt[];
  pendingLink?: PaymentLink;
}

interface AppDataValue {
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];
  receipts: Receipt[];
  paymentLinks: PaymentLink[];
  employees: Employee[];
  products: Product[];

  getCompany: (id: string) => Company | undefined;
  addCompany: (c: Omit<Company, "id">) => Company;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  getContact: (id: string) => Contact | undefined;
  getContactDeals: (contactId: string) => Deal[];
  getContactActivities: (contactId: string) => Activity[];
  getDealActivities: (dealId: string) => Activity[];
  getDeal: (id: string) => Deal | undefined;

  addContact: (c: Omit<Contact, "id" | "createdAt">) => Contact;
  updateContact: (id: string, patch: Partial<Contact>) => void;

  addDeal: (d: Omit<Deal, "id" | "createdAt" | "stageChangedAt">) => Deal;
  moveDealStage: (dealId: string, stage: DealStage) => void;

  addActivity: (a: Omit<Activity, "id" | "timestamp">) => Activity;

  addTask: (t: Omit<Task, "id">) => Task;
  toggleTask: (id: string) => void;

  getSaleInfo: (dealId: string) => SaleInfo;
  allSales: () => SaleInfo[];
  findByReceiptNumber: (query: string) => SaleInfo[];

  createPaymentLink: (dealId: string, type: PaymentType, amount: number, gateway: PaymentGateway) => PaymentLink;
  simulatePaymentReceived: (linkId: string) => void;

  getEmployee: (id: string) => Employee | undefined;
  addEmployee: (e: Omit<Employee, "id" | "joinedAt" | "status">) => Employee;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  toggleEmployeeStatus: (id: string) => void;

  getProduct: (id: string) => Product | undefined;
  addProduct: (p: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  adjustStock: (id: string, delta: number) => void;

  resetDemoData: () => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => clone(seedCompanies));
  const [contacts, setContacts] = useState<Contact[]>(() => clone(seedContacts));
  const [deals, setDeals] = useState<Deal[]>(() => clone(seedDeals));
  const [activities, setActivities] = useState<Activity[]>(() => clone(seedActivities));
  const [tasks, setTasks] = useState<Task[]>(() => clone(seedTasks));
  const [receipts, setReceipts] = useState<Receipt[]>(() => clone(seedReceipts));
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(() => clone(seedPaymentLinks));
  const [employees, setEmployees] = useState<Employee[]>(() => clone(seedEmployees));
  const [products, setProducts] = useState<Product[]>(() => clone(seedProducts));
  const { showToast } = useToast();
  const hydrated = useRef(false);

  // Restore any in-progress demo state (e.g. payments simulated earlier in this
  // session) so it's visible across tabs/reloads — state otherwise lives only
  // in memory and a fresh mount would reseed from the static fixtures.
  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      setContacts(saved.contacts);
      setDeals(saved.deals);
      setActivities(saved.activities);
      setTasks(saved.tasks);
      setReceipts(saved.receipts);
      setPaymentLinks(saved.paymentLinks);
      if (saved.employees) setEmployees(saved.employees);
      if (saved.companies) setCompanies(saved.companies);
      if (saved.products) setProducts(saved.products);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const snapshot: PersistedShape = {
      contacts,
      deals,
      activities,
      tasks,
      receipts,
      paymentLinks,
      employees,
      companies,
      products,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // storage unavailable — demo continues in-memory only
    }
  }, [contacts, deals, activities, tasks, receipts, paymentLinks, employees, companies, products]);

  const resetDemoData = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setContacts(clone(seedContacts));
    setDeals(clone(seedDeals));
    setActivities(clone(seedActivities));
    setTasks(clone(seedTasks));
    setReceipts(clone(seedReceipts));
    setPaymentLinks(clone(seedPaymentLinks));
    setEmployees(clone(seedEmployees));
    setCompanies(clone(seedCompanies));
    setProducts(clone(seedProducts));
    showToast("Demo data reset to defaults", "info");
  }, [showToast]);

  const getCompany = useCallback((id: string) => companies.find((c) => c.id === id), [companies]);

  const addCompany = useCallback(
    (c: Omit<Company, "id">) => {
      const newCompany: Company = { ...c, id: genId("co") };
      setCompanies((prev) => [newCompany, ...prev]);
      showToast(`Company "${newCompany.name}" added`, "success");
      return newCompany;
    },
    [showToast]
  );

  const updateCompany = useCallback(
    (id: string, patch: Partial<Company>) => {
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      showToast("Company updated", "success");
    },
    [showToast]
  );
  const getContact = useCallback((id: string) => contacts.find((c) => c.id === id), [contacts]);
  const getDeal = useCallback((id: string) => deals.find((d) => d.id === id), [deals]);
  const getContactDeals = useCallback((contactId: string) => deals.filter((d) => d.contactId === contactId), [deals]);
  const getContactActivities = useCallback(
    (contactId: string) =>
      activities.filter((a) => a.contactId === contactId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [activities]
  );
  const getDealActivities = useCallback(
    (dealId: string) =>
      activities.filter((a) => a.dealId === dealId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [activities]
  );

  const addContact = useCallback((c: Omit<Contact, "id" | "createdAt">) => {
    const newContact: Contact = { ...c, id: genId("ct"), createdAt: new Date().toISOString().slice(0, 10) };
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  }, []);

  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addDeal = useCallback((d: Omit<Deal, "id" | "createdAt" | "stageChangedAt">) => {
    const now = new Date().toISOString().slice(0, 10);
    const newDeal: Deal = { ...d, id: genId("dl"), createdAt: now, stageChangedAt: now };
    setDeals((prev) => [newDeal, ...prev]);
    return newDeal;
  }, []);

  const addActivity = useCallback((a: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = { ...a, id: genId("ac"), timestamp: new Date().toISOString() };
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  }, []);

  const addTask = useCallback((t: Omit<Task, "id">) => {
    const newTask: Task = { ...t, id: genId("tk") };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t))
    );
  }, []);

  const moveDealStage = useCallback(
    (dealId: string, stage: DealStage) => {
      const deal = deals.find((d) => d.id === dealId);
      if (!deal || deal.stage === stage) return;
      const now = new Date().toISOString();
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage, stageChangedAt: now.slice(0, 10) } : d)));
      setActivities((prev) => [
        {
          id: genId("ac"),
          contactId: deal.contactId,
          dealId,
          type: "note",
          title: "Stage changed",
          body: `Deal moved from ${deal.stage} to ${stage}.`,
          timestamp: now,
        },
        ...prev,
      ]);

      if (stage === "Proposal") {
        const due = new Date();
        due.setDate(due.getDate() + 3);
        setTasks((prev) => [
          {
            id: genId("tk"),
            title: `Follow up on proposal: ${deal.title}`,
            dueDate: due.toISOString().slice(0, 10),
            status: "pending",
            priority: "high",
            assignee: deal.owner,
            contactId: deal.contactId,
            dealId,
          },
          ...prev,
        ]);
        showToast(`Automation: follow-up task created for "${deal.title}"`, "info");
      } else if (stage === "Won" && deal.productId) {
        const product = products.find((p) => p.id === deal.productId);
        if (product) {
          const nextQuantity = Math.max(0, product.stockQuantity - 1);
          setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stockQuantity: nextQuantity } : p)));
          showToast(
            nextQuantity <= product.reorderLevel
              ? `"${deal.title}" won — 1 unit of ${product.name} shipped. Low stock: ${nextQuantity} left`
              : `"${deal.title}" won — 1 unit of ${product.name} shipped from stock`,
            "success"
          );
        } else {
          showToast(`"${deal.title}" moved to ${stage}`, "success");
        }
      } else {
        showToast(`"${deal.title}" moved to ${stage}`, "success");
      }
    },
    [deals, products, showToast]
  );

  const getSaleInfo = useCallback(
    (dealId: string): SaleInfo => {
      const deal = deals.find((d) => d.id === dealId)!;
      const dealReceipts = receipts.filter((r) => r.dealId === dealId);
      const totalPaid = dealReceipts.reduce((sum, r) => sum + r.amount, 0);
      const pendingLink = paymentLinks.find((p) => p.dealId === dealId && p.status === "pending");
      let status: SalePaymentStatus = "Unpaid";
      if (totalPaid > 0 && totalPaid >= deal.value) status = "Paid in Full";
      else if (totalPaid > 0) status = "Advance Paid";
      return { deal, totalPaid, status, receipts: dealReceipts, pendingLink };
    },
    [deals, receipts, paymentLinks]
  );

  const allSales = useCallback((): SaleInfo[] => {
    return deals
      .filter((d) => receipts.some((r) => r.dealId === d.id) || paymentLinks.some((p) => p.dealId === d.id) || d.stage === "Won")
      .map((d) => getSaleInfo(d.id));
  }, [deals, receipts, paymentLinks, getSaleInfo]);

  const findByReceiptNumber = useCallback(
    (query: string): SaleInfo[] => {
      const q = query.trim().toLowerCase();
      if (!q) return allSales();
      const matchingDealIds = new Set(
        receipts.filter((r) => r.receiptNumber.toLowerCase().includes(q)).map((r) => r.dealId)
      );
      return allSales().filter((s) => {
        if (matchingDealIds.has(s.deal.id)) return true;
        const contact = getContact(s.deal.contactId);
        return (
          s.deal.title.toLowerCase().includes(q) ||
          (contact && contact.name.toLowerCase().includes(q))
        );
      });
    },
    [receipts, allSales, getContact]
  );

  const createPaymentLink = useCallback(
    (dealId: string, type: PaymentType, amount: number, gateway: PaymentGateway): PaymentLink => {
      const link: PaymentLink = {
        id: genId("pl"),
        dealId,
        type,
        amount,
        gateway,
        url: `https://pay.sharkonix.lk/l/${Math.random().toString(36).slice(2, 10)}`,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setPaymentLinks((prev) => [link, ...prev.filter((p) => !(p.dealId === dealId && p.status === "pending"))]);
      showToast(`${gateway} payment link created for ${type === "advance" ? "advance" : "full"} payment`, "success");
      return link;
    },
    [showToast]
  );

  const simulatePaymentReceived = useCallback(
    (linkId: string) => {
      const link = paymentLinks.find((p) => p.id === linkId);
      if (!link) return;
      const deal = deals.find((d) => d.id === link.dealId);
      if (!deal) return;

      const existingPaid = receipts.filter((r) => r.dealId === link.dealId).reduce((s, r) => s + r.amount, 0);
      const isBalance = link.type === "full" && existingPaid > 0;
      const receiptType = isBalance ? "balance" : link.type;

      const nextNumber = receipts.length + 1;
      const receiptNumber = `RCPT-2026-${String(nextNumber).padStart(4, "0")}`;
      const contact = contacts.find((c) => c.id === deal.contactId);

      const newReceipt: Receipt = {
        id: genId("rc"),
        receiptNumber,
        dealId: link.dealId,
        amount: link.amount,
        type: receiptType,
        gateway: link.gateway,
        customerName: contact?.name ?? "Customer",
        date: new Date().toISOString().slice(0, 10),
      };

      setReceipts((prev) => [...prev, newReceipt]);
      setPaymentLinks((prev) => prev.map((p) => (p.id === linkId ? { ...p, status: "paid" } : p)));
      setActivities((prev) => [
        {
          id: genId("ac"),
          contactId: deal.contactId,
          dealId: deal.id,
          type: "note",
          title: "Payment received",
          body: `${link.type === "advance" ? "Advance" : "Full"} payment of $${link.amount.toLocaleString()} received via ${link.gateway}. Receipt ${receiptNumber} generated.`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast(`Payment received — receipt ${receiptNumber} generated`, "success");
    },
    [paymentLinks, deals, receipts, contacts, showToast]
  );

  const getEmployee = useCallback((id: string) => employees.find((e) => e.id === id), [employees]);

  const addEmployee = useCallback(
    (e: Omit<Employee, "id" | "joinedAt" | "status">) => {
      const newEmployee: Employee = {
        ...e,
        id: genId("em"),
        status: "active",
        joinedAt: new Date().toISOString().slice(0, 10),
      };
      setEmployees((prev) => [newEmployee, ...prev]);
      showToast(`${newEmployee.name} added to the team`, "success");
      return newEmployee;
    },
    [showToast]
  );

  const updateEmployee = useCallback(
    (id: string, patch: Partial<Employee>) => {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
      showToast("Employee updated", "success");
    },
    [showToast]
  );

  const toggleEmployeeStatus = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;
      const nextStatus = employee.status === "active" ? "inactive" : "active";
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e)));
      showToast(
        nextStatus === "active" ? `${employee.name} reactivated` : `${employee.name} deactivated`,
        nextStatus === "active" ? "success" : "info"
      );
    },
    [employees, showToast]
  );

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addProduct = useCallback(
    (p: Omit<Product, "id" | "createdAt">) => {
      const newProduct: Product = { ...p, id: genId("pr"), createdAt: new Date().toISOString().slice(0, 10) };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`"${newProduct.name}" added to stock`, "success");
      return newProduct;
    },
    [showToast]
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      showToast("Product updated", "success");
    },
    [showToast]
  );

  const adjustStock = useCallback(
    (id: string, delta: number) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const nextQuantity = Math.max(0, product.stockQuantity + delta);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stockQuantity: nextQuantity } : p)));
      if (delta > 0) {
        showToast(`Restocked ${product.name}: +${delta} units (${nextQuantity} on hand)`, "success");
      } else if (nextQuantity <= product.reorderLevel) {
        showToast(`Low stock: ${product.name} has only ${nextQuantity} left`, "info");
      }
    },
    [products, showToast]
  );

  const value = useMemo<AppDataValue>(
    () => ({
      companies,
      contacts,
      deals,
      activities,
      tasks,
      receipts,
      paymentLinks,
      employees,
      products,
      getCompany,
      addCompany,
      updateCompany,
      getContact,
      getContactDeals,
      getContactActivities,
      getDealActivities,
      getDeal,
      addContact,
      updateContact,
      addDeal,
      moveDealStage,
      addActivity,
      addTask,
      toggleTask,
      getSaleInfo,
      allSales,
      findByReceiptNumber,
      createPaymentLink,
      simulatePaymentReceived,
      getEmployee,
      addEmployee,
      updateEmployee,
      toggleEmployeeStatus,
      getProduct,
      addProduct,
      updateProduct,
      adjustStock,
      resetDemoData,
    }),
    [
      companies,
      contacts,
      deals,
      activities,
      tasks,
      receipts,
      paymentLinks,
      employees,
      products,
      getCompany,
      addCompany,
      updateCompany,
      getContact,
      getContactDeals,
      getContactActivities,
      getDealActivities,
      getDeal,
      addContact,
      updateContact,
      addDeal,
      moveDealStage,
      addActivity,
      addTask,
      toggleTask,
      getSaleInfo,
      resetDemoData,
      allSales,
      findByReceiptNumber,
      createPaymentLink,
      simulatePaymentReceived,
      getEmployee,
      addEmployee,
      updateEmployee,
      toggleEmployeeStatus,
      getProduct,
      addProduct,
      updateProduct,
      adjustStock,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
