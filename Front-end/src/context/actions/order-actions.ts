import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStockStatus } from "@/lib/product-utils";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { Coupon, Customer, Order, Product } from "@/types/store";

interface OrderActionDeps {
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  activeCoupon: Coupon | null;
  setActiveCoupon: Dispatch<SetStateAction<Coupon | null>>;
  clearCart: () => void;
  setCurrentUserEmail: Dispatch<SetStateAction<string | null>>;
}

export const useOrderActions = ({
  orders,
  setOrders,
  customers,
  setCustomers,
  products,
  setProducts,
  coupons,
  setCoupons,
  activeCoupon,
  setActiveCoupon,
  clearCart,
  setCurrentUserEmail,
}: OrderActionDeps) => {
  const placeOrder = useCallback((orderData: Omit<Order, "id" | "orderDate" | "status">) => {
    const newId = `VL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderDate: new Date().toISOString(),
      status: "New Order",
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    setStorageItem(STORAGE_KEYS.ORDERS, newOrders);

    const customerIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === orderData.customerEmail.toLowerCase()
    );

    const updatedCustomers = [...customers];
    if (customerIndex > -1) {
      updatedCustomers[customerIndex].orderCount += 1;
      updatedCustomers[customerIndex].totalSpent += orderData.totalPrice;
    } else {
      updatedCustomers.push({
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
        city: orderData.customerCity,
        orderCount: 1,
        totalSpent: orderData.totalPrice,
        joinDate: new Date().toISOString().split("T")[0],
      });
    }
    setCustomers(updatedCustomers);
    setStorageItem(STORAGE_KEYS.CUSTOMERS, updatedCustomers);

    const updatedProducts = products.map((prod) => {
      const orderItem = orderData.items.find((item) => item.productId === prod.id);
      if (orderItem) {
        const remainingStock = Math.max(0, prod.stock - orderItem.quantity);
        
        let updatedVariants = prod.variants;
        if (prod.variants && prod.variants.length > 0) {
          updatedVariants = prod.variants.map((v) => {
            const matchSize = !v.size || v.size === orderItem.size;
            const matchFlavor = !v.flavor || v.flavor === orderItem.variant;
            if (matchSize && matchFlavor) {
              const newQty = Math.max(0, v.stockQuantity - orderItem.quantity);
              return {
                ...v,
                stockQuantity: newQty,
                isAvailable: newQty > 0
              };
            }
            return v;
          });
        }

        return {
          ...prod,
          variants: updatedVariants,
          stock: remainingStock,
          stockStatus: getStockStatus(remainingStock),
        } as Product;
      }
      return prod;
    });
    setProducts(updatedProducts);
    setStorageItem(STORAGE_KEYS.PRODUCTS, updatedProducts);

    if (activeCoupon) {
      const updatedCoupons = coupons.map((c) => {
        if (c.id === activeCoupon.id) {
          return { ...c, usageCount: c.usageCount + 1 };
        }
        return c;
      });
      setCoupons(updatedCoupons);
      setStorageItem(STORAGE_KEYS.COUPONS, updatedCoupons);
      setActiveCoupon(null);
    }

    clearCart();
    setCurrentUserEmail(orderData.customerEmail);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, orderData.customerEmail);
    showToast(`Order ${newId} placed successfully!`, "success");
    return newOrder;
  }, [
    activeCoupon,
    clearCart,
    coupons,
    customers,
    orders,
    products,
    setActiveCoupon,
    setCoupons,
    setCustomers,
    setOrders,
    setProducts,
    setCurrentUserEmail,
  ]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    const newOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    setOrders(newOrders);
    setStorageItem(STORAGE_KEYS.ORDERS, newOrders);
    showToast(`Order ${orderId} marked as ${status}`, "info");
  }, [orders, setOrders]);

  const confirmOrder = useCallback((orderId: string) => {
    updateOrderStatus(orderId, "Confirmed");
  }, [updateOrderStatus]);

  const cancelOrder = useCallback((orderId: string) => {
    updateOrderStatus(orderId, "Cancelled");
  }, [updateOrderStatus]);

  return useMemo(
    () => ({ placeOrder, updateOrderStatus, confirmOrder, cancelOrder }),
    [placeOrder, updateOrderStatus, confirmOrder, cancelOrder]
  );
};
