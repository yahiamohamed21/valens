import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { getStockStatus } from "@/lib/product-utils";
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
  const placeOrder = useCallback(async (orderData: Omit<Order, "id" | "orderDate" | "status">) => {
    try {
      const checkoutItems = orderData.items.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const matchingVariant = prod?.variants?.find(
          (v) => v.size === item.size && v.flavor === item.variant
        );
        return {
          productId: item.productId,
          variantId: matchingVariant?.id || null,
          size: item.size || undefined,
          flavor: item.variant || undefined,
          quantity: item.quantity,
        };
      });

      const response = (await api.orders.checkout({
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.customerAddress,
        shippingCity: orderData.customerCity,
        couponCode: orderData.couponCode || undefined,
        items: checkoutItems,
      })) as {
        id?: string;
        orderName?: string;
        orderNumber?: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        customerAddress?: string;
        shippingAddress?: string;
        customerCity?: string;
        shippingCity?: string;
        notes?: string;
        items?: {
          productId?: string;
          productName?: string;
          product?: { name?: string };
          price?: number;
          quantity?: number;
          size?: string;
          variant?: string;
          flavor?: string;
          imageColor?: string;
          imageType?: "powder" | "capsule" | "liquid";
          image?: string;
        }[];
        totalPrice?: number;
        paymentMethod?: string;
        shippingMethod?: string;
        shippingCost?: number;
        discountAmount?: number;
        couponCode?: string;
        orderDate?: string;
        status?: Order["status"];
      };

      const newOrder: Order = {
        id: response.id || response.orderName || response.orderNumber || `VL-${Date.now()}`,
        orderName: response.orderName || response.orderNumber || response.id || `VL-${Date.now()}`,
        customerName: response.customerName || orderData.customerName,
        customerPhone: response.customerPhone || orderData.customerPhone,
        customerEmail: response.customerEmail || orderData.customerEmail,
        customerAddress: response.customerAddress || response.shippingAddress || orderData.customerAddress,
        customerCity: response.customerCity || response.shippingCity || orderData.customerCity,
        notes: response.notes || orderData.notes,
        items: response.items?.map((item) => ({
          productId: item.productId || "",
          productName: item.productName || item.product?.name || "",
          price: item.price || 0,
          quantity: item.quantity || 1,
          size: item.size || "",
          variant: item.variant || item.flavor || "",
          imageColor: item.imageColor || "",
          imageType: item.imageType || "powder",
          image: item.image || "",
        })) || orderData.items,
        totalPrice: response.totalPrice || orderData.totalPrice,
        paymentMethod: response.paymentMethod || orderData.paymentMethod,
        shippingMethod: response.shippingMethod || orderData.shippingMethod,
        shippingCost: response.shippingCost || orderData.shippingCost,
        discountAmount: response.discountAmount || orderData.discountAmount,
        couponCode: response.couponCode || orderData.couponCode,
        orderDate: response.orderDate || new Date().toISOString(),
        status: response.status || "New Order",
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Refresh customers list or update locally
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

      // Decrement stock local fallback in case overview is not refreshed immediately
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
                  isAvailable: newQty > 0,
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

      if (activeCoupon) {
        setCoupons((prev) =>
          prev.map((c) => {
            if (c.code.toUpperCase() === activeCoupon.code.toUpperCase()) {
              return { ...c, usageCount: c.usageCount + 1 };
            }
            return c;
          })
        );
        setActiveCoupon(null);
      }

      clearCart();
      setCurrentUserEmail(orderData.customerEmail);
      if (typeof window !== "undefined") {
        localStorage.setItem("valens_current_user", orderData.customerEmail);
      }
      showToast(`Order ${newOrder.id} placed successfully!`, "success");
      return newOrder;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      showToast(message, "error");
      throw error;
    }
  }, [
    activeCoupon,
    clearCart,
    setCoupons,
    customers,
    setCustomers,
    products,
    setProducts,
    setActiveCoupon,
    setOrders,
    setCurrentUserEmail,
  ]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    try {
      await api.orders.updateStatus({ id: orderId, status });
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return { ...ord, status };
          }
          return ord;
        })
      );
      showToast(`Order ${orderId} marked as ${status}`, "info");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update order status";
      showToast(message, "error");
    }
  }, [setOrders]);

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
