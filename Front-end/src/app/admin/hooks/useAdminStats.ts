import { useMemo } from "react";
import { Order, Expense, Product, Customer } from "@/context/AppContext";

export const useAdminStats = (
  orders: Order[],
  expenses: Expense[],
  products: Product[],
  customers: Customer[]
) => {
  const totals = useMemo(() => {
    // Orders filters
    const totalOrdersCount = orders.length;
    const newOrders = orders.filter((o) => o.status === "New Order").length;
    const confirmedOrders = orders.filter((o) => o.status === "Confirmed").length;
    const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
    const returnedOrdersCount = orders.filter((o) => o.status === "Returned").length;

    // Gross Sales: completed delivered + returned orders totalPrice
    const grossSales = orders
      .filter((o) => o.status === "Delivered" || o.status === "Returned")
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    // Returned Orders Value: sum of refundAmount (or totalPrice fallback) for returned orders
    const returnedValue = orders
      .filter((o) => o.status === "Returned")
      .reduce((acc, curr) => acc + (curr.refundAmount !== undefined ? curr.refundAmount : curr.totalPrice), 0);

    const netSales = grossSales - returnedValue;
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = netSales - totalExpenses;

    // Inventory calculations
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stockStatus === "Low Stock" || p.stock === 0).length;
    const totalCustomers = customers.length;

    return {
      totalOrdersCount,
      newOrders,
      confirmedOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrdersCount,
      totalSales: grossSales, // keep as totalSales (gross) for backward compatibility
      grossSales,
      returnedOrdersValue: returnedValue,
      refundAmount: returnedValue,
      netSales,
      totalExpenses,
      netProfit,
      totalProducts,
      lowStockProducts,
      totalCustomers
    };
  }, [orders, expenses, products, customers]);

  const expensesByCategory = useMemo(() => {
    const categoriesMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
    });
    return Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return { totals, expensesByCategory };
};
