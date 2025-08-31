import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = "default-user-id";

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories(DEFAULT_USER_ID);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid category data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const transactions = await storage.getTransactions(
        DEFAULT_USER_ID,
        startDate as string,
        endDate as string
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create transaction" });
      }
    }
  });

  // Budgets routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const { month } = req.query;
      const budgets = await storage.getBudgets(DEFAULT_USER_ID, month as string);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const budget = await storage.createBudget(validatedData);
      res.json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid budget data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create budget" });
      }
    }
  });

  app.put("/api/budgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(id, updateData);
      
      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }
      
      res.json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid budget data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update budget" });
      }
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const { month } = req.query;
      const currentMonth = month as string || new Date().toISOString().slice(0, 7);
      
      // Get current month transactions
      const startDate = `${currentMonth}-01`;
      const endDate = `${currentMonth}-31`;
      const transactions = await storage.getTransactions(DEFAULT_USER_ID, startDate, endDate);
      
      // Calculate totals
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const netSavings = income - expenses;
      
      // Get budgets for current month
      const budgets = await storage.getBudgets(DEFAULT_USER_ID, currentMonth);
      const categories = await storage.getCategories(DEFAULT_USER_ID);
      
      // Calculate budget progress
      const budgetProgress = budgets.map(budget => {
        const category = categories.find(c => c.id === budget.categoryId);
        const spent = transactions
          .filter(t => t.categoryId === budget.categoryId && t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        return {
          ...budget,
          categoryName: category?.name || 'Unknown',
          categoryColor: category?.color || '#000000',
          spent,
          remaining: parseFloat(budget.amount) - spent,
          percentage: (spent / parseFloat(budget.amount)) * 100,
        };
      });
      
      res.json({
        income,
        expenses,
        netSavings,
        budgetProgress,
        transactionCount: transactions.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  // Export routes
  app.get("/api/export/csv", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const transactions = await storage.getTransactions(
        DEFAULT_USER_ID,
        startDate as string,
        endDate as string
      );
      const categories = await storage.getCategories(DEFAULT_USER_ID);
      
      // Create CSV content
      const csvHeader = "Date,Description,Category,Type,Amount\n";
      const csvRows = transactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return `${t.date.toISOString().split('T')[0]},${t.description},${category?.name || 'Unknown'},${t.type},${t.amount}`;
      }).join('\n');
      
      const csvContent = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
