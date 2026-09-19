import { customerService } from './customerService';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'customer' | 'admin';
}

const STORAGE_KEY_AUTH = 'amuthin_auth_user';

const getStoredUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id && parsed.role) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

let currentUser: UserProfile | null = getStoredUser();

export const authService = {
  getCurrentUser: async (): Promise<UserProfile | null> => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    return currentUser;
  },

  /**
   * Customer Login / Register
   * Accepts ONLY phone number and name.
   * Name is automatically lowercased and saved to initial data / customers store.
   */
  loginCustomer: async (name: string, phone: string): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Force lowercased name as explicitly specified
    const lowerName = name.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check if customer already exists with this phone
    const allCustomers = await customerService.getCustomers();
    const existing = allCustomers.find(
      (c) => c.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
    );

    let customerId = existing?.id;

    if (!existing) {
      // Create new customer profile and append to initial data / customers list
      customerId = `cust-${Date.now()}`;
      const newCustomer = {
        id: customerId,
        name: lowerName,
        email: `${lowerName.replace(/[^a-z0-9]/g, '') || 'user'}@amuthin.com`,
        phone: cleanPhone,
        joinedDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        addresses: [],
      };
      await customerService.addCustomer(newCustomer);
    } else {
      // Update name to lowercased version if changed
      await customerService.updateCustomerProfile(existing.id, { name: lowerName });
    }

    currentUser = {
      id: customerId || `cust-${Date.now()}`,
      name: lowerName,
      email: existing?.email || `${lowerName.replace(/[^a-z0-9]/g, '') || 'customer'}@amuthin.com`,
      phone: cleanPhone,
      role: 'customer',
    };

    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } catch {
      // ignore
    }

    return currentUser;
  },

  /**
   * Admin Login with credentials verification
   * Normal users cannot access admin without correct admin credentials.
   */
  loginAdmin: async (
    username: string,
    pass: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // Verified Admin Credentials
    const isValid =
      (trimmedUser === 'admin' && trimmedPass === 'amuthin123') ||
      (trimmedUser === 'admin' && trimmedPass === 'admin') ||
      (trimmedUser === 'amuthin' && trimmedPass === 'amuthin123');

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid credentials. Please enter valid admin username & password.',
      };
    }

    currentUser = {
      id: 'admin-1',
      name: 'Store Administrator',
      email: 'admin@amuthintraders.com',
      phone: '+91 98421 54321',
      role: 'admin',
    };

    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } catch {
      // ignore
    }

    return { success: true, user: currentUser };
  },

  /**
   * Legacy switchRole kept for compatibility if needed
   */
  switchRole: async (role: 'customer' | 'admin'): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    currentUser = {
      id: role === 'admin' ? 'admin-1' : (currentUser?.id || 'cust-1'),
      name: role === 'admin' ? 'Store Administrator' : (currentUser?.name || 'karthick raja'),
      email: role === 'admin' ? 'admin@amuthintraders.com' : (currentUser?.email || 'karthickrajasitpl@gmail.com'),
      phone: currentUser?.phone || '+91 98421 54321',
      role,
    };
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } catch {
      // ignore
    }
    return currentUser;
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    currentUser = null;
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // ignore
    }
  },
};
