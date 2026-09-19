import { initialCategories, initialSubCategories } from '../data/initialData';
import { Category, SubCategory } from '../types';

const STORAGE_KEY_CATEGORIES = 'amuthin_categories';

const getStoredCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [...initialCategories];
};

const saveCategories = (cats: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
  } catch {
    // fallback
  }
};

let categoriesStore: Category[] = getStoredCategories();
let subCategoriesStore: SubCategory[] = [...initialSubCategories];

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...categoriesStore];
  },

  getCategoryById: async (id: string): Promise<Category | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return categoriesStore.find((c) => c.id === id);
  },

  getSubCategories: async (categoryId?: string): Promise<SubCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    if (!categoryId) return [...subCategoriesStore];
    return subCategoriesStore.filter((sc) => sc.categoryId === categoryId);
  },

  addCategory: async (categoryData: Partial<Category>): Promise<Category> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newCat: Category = {
      id: categoryData.id || `cat-${Date.now()}`,
      name: categoryData.name || 'New Category',
      tamilName: categoryData.tamilName || '',
      description: categoryData.description || '',
      image: categoryData.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      featured: Boolean(categoryData.featured),
      subCategories: categoryData.subCategories || [],
    };
    categoriesStore = [...categoriesStore, newCat];
    saveCategories(categoriesStore);
    return newCat;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = categoriesStore.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Category ${id} not found`);
    categoriesStore[index] = { ...categoriesStore[index], ...updates };
    saveCategories(categoriesStore);
    return categoriesStore[index];
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
    saveCategories(categoriesStore);
    return true;
  },

  addSubCategory: async (categoryId: string, name: string): Promise<SubCategory> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const newSub: SubCategory = {
      id: `sub-${Date.now()}`,
      categoryId,
      name,
    };
    subCategoriesStore = [...subCategoriesStore, newSub];
    const cat = categoriesStore.find((c) => c.id === categoryId);
    if (cat && !cat.subCategories.includes(name)) {
      cat.subCategories.push(name);
      saveCategories(categoriesStore);
    }
    return newSub;
  },

  deleteSubCategory: async (categoryId: string, subCategoryName: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    subCategoriesStore = subCategoriesStore.filter(
      (sc) => !(sc.categoryId === categoryId && sc.name === subCategoryName)
    );
    const cat = categoriesStore.find((c) => c.id === categoryId);
    if (cat) {
      cat.subCategories = cat.subCategories.filter((s) => s !== subCategoryName);
      saveCategories(categoriesStore);
    }
    return true;
  },
};
