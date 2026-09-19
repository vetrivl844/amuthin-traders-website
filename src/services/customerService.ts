import { initialCustomers } from '../data/initialData';
import { Customer, Address } from '../types';

const STORAGE_KEY_CUSTOMERS = 'amuthin_customers';

const getStoredCustomers = (): Customer[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [...initialCustomers];
};

const saveCustomers = (customers: Customer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  } catch {
    // storage not available
  }
};

let customersStore: Customer[] = getStoredCustomers();

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...customersStore];
  },

  getCustomerById: async (id: string): Promise<Customer | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return customersStore.find((c) => c.id === id);
  },

  getCurrentCustomer: async (): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return customersStore[0];
  },

  updateCustomerProfile: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const index = customersStore.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found`);
    customersStore[index] = { ...customersStore[index], ...updates };
    saveCustomers(customersStore);
    return customersStore[index];
  },

  addCustomer: async (customer: Customer): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    customersStore = [customer, ...customersStore.filter((c) => c.id !== customer.id)];
    saveCustomers(customersStore);
    return customer;
  },

  getAddresses: async (customerId = 'cust-1'): Promise<Address[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const customer = customersStore.find((c) => c.id === customerId) || customersStore[0];
    return customer ? [...customer.addresses] : [];
  },

  addAddress: async (
    param1: string | Address,
    param2?: Address
  ): Promise<Address[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    let customerId = 'cust-1';
    let address: Address;

    if (typeof param1 === 'string' && param2) {
      customerId = param1;
      address = param2;
    } else {
      address = param1 as Address;
    }

    const customer = customersStore.find((c) => c.id === customerId) || customersStore[0];
    if (!customer) throw new Error('Customer not found');

    const newAddr: Address = {
      ...address,
      id: address.id || `addr-${Date.now()}`,
      isDefault: address.isDefault ?? true,
      type: address.type ?? 'Home',
    };

    customer.addresses = [newAddr, ...customer.addresses];
    saveCustomers(customersStore);
    return [...customer.addresses];
  },

  deleteAddress: async (customerId: string, addressId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const customer = customersStore.find((c) => c.id === customerId);
    if (!customer) return false;
    customer.addresses = customer.addresses.filter((a) => a.id !== addressId);
    saveCustomers(customersStore);
    return true;
  },
};
