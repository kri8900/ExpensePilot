import { type User, type InsertUser, type Category, type InsertCategory, type Transaction, type InsertTransaction, type Budget, type InsertBudget } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  getTransactions(userId: string, startDate?: string, endDate?: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  getBudgets(userId: string, month?: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private transactions: Map<string, Transaction>;
  private budgets: Map<string, Budget>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    
    // Initialize with default user and categories
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultUser: User = {
      id: "default-user-id",
      username: "demo",
      password: "demo123"
    };
    this.users.set(defaultUser.id, defaultUser);

    const defaultCategories: Category[] = [
      { id: "cat-1", name: "Food & Dining", icon: "fas fa-utensils", color: "#FB923C", userId: defaultUser.id },
      { id: "cat-2", name: "Transportation", icon: "fas fa-gas-pump", color: "#3B82F6", userId: defaultUser.id },
      { id: "cat-3", name: "Entertainment", icon: "fas fa-film", color: "#8B5CF6", userId: defaultUser.id },
      { id: "cat-4", name: "Utilities", icon: "fas fa-bolt", color: "#10B981", userId: defaultUser.id },
      { id: "cat-5", name: "Shopping", icon: "fas fa-shopping-bag", color: "#EC4899", userId: defaultUser.id },
      { id: "cat-6", name: "Healthcare", icon: "fas fa-heart", color: "#F59E0B", userId: defaultUser.id },
      { id: "cat-7", name: "Income", icon: "fas fa-briefcase", color: "#10B981", userId: defaultUser.id },
    ];

    defaultCategories.forEach(cat => this.categories.set(cat.id, cat));

    // Add sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: "txn-1",
        amount: "2500.00",
        description: "Salary",
        categoryId: "cat-7",
        type: "income",
        date: new Date("2025-08-15"),
        userId: defaultUser.id,
        createdAt: new Date("2025-08-15"),
      },
      {
        id: "txn-2", 
        amount: "45.50",
        description: "Lunch at Italian Restaurant",
        categoryId: "cat-1",
        type: "expense",
        date: new Date("2025-08-20"),
        userId: defaultUser.id,
        createdAt: new Date("2025-08-20"),
      },
      {
        id: "txn-3",
        amount: "120.00",
        description: "Gas Station Fill-up",
        categoryId: "cat-2", 
        type: "expense",
        date: new Date("2025-08-18"),
        userId: defaultUser.id,
        createdAt: new Date("2025-08-18"),
      },
      {
        id: "txn-4",
        amount: "25.99",
        description: "Netflix Subscription",
        categoryId: "cat-3",
        type: "expense", 
        date: new Date("2025-08-01"),
        userId: defaultUser.id,
        createdAt: new Date("2025-08-01"),
      },
      {
        id: "txn-5",
        amount: "85.40",
        description: "Electricity Bill",
        categoryId: "cat-4",
        type: "expense",
        date: new Date("2025-08-05"),
        userId: defaultUser.id,
        createdAt: new Date("2025-08-05"),
      }
    ];

    sampleTransactions.forEach(txn => this.transactions.set(txn.id, txn));

    // Add sample budgets
    const sampleBudgets: Budget[] = [
      {
        id: "budget-1",
        categoryId: "cat-1",
        amount: "300.00",
        month: "2025-08",
        userId: defaultUser.id,
      },
      {
        id: "budget-2",
        categoryId: "cat-2", 
        amount: "200.00",
        month: "2025-08",
        userId: defaultUser.id,
      },
      {
        id: "budget-3",
        categoryId: "cat-3",
        amount: "100.00", 
        month: "2025-08",
        userId: defaultUser.id,
      }
    ];

    sampleBudgets.forEach(budget => this.budgets.set(budget.id, budget));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategories(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.userId === userId);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getTransactions(userId: string, startDate?: string, endDate?: string): Promise<Transaction[]> {
    let transactions = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      date: new Date(insertTransaction.date),
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getBudgets(userId: string, month?: string): Promise<Budget[]> {
    let budgets = Array.from(this.budgets.values()).filter(b => b.userId === userId);
    
    if (month) {
      budgets = budgets.filter(b => b.month === month);
    }
    
    return budgets;
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = { ...insertBudget, id };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...updateData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
}

export const storage = new MemStorage();
