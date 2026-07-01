import React, { useState, useEffect } from "react";
import { Order, useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  onUpdateLocalOrder?: (order: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  updateOrderStatus,
  onUpdateLocalOrder,
}) => {
  const { returnOrder } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone);
  const [shippingAddress, setShippingAddress] = useState(order.customerAddress);
  const [shippingCity, setShippingCity] = useState(order.customerCity);
  const [isSaving, setIsSaving] = useState(false);

  // Return Order Modal states
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Dissatisfied with product");
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [returnNotes, setReturnNotes] = useState("");
  const [isStockRestored, setIsStockRestored] = useState(true);
  const [itemReturns, setItemReturns] = useState<Record<string, { checked: boolean; quantity: number }>>({});

  const handleRefundChange = (val: string) => {
    setRefundAmount(parseFloat(val) || 0);
  };

  // Initialize returned items state
  useEffect(() => {
    if (isReturnModalOpen) {
      const initial: Record<string, { checked: boolean; quantity: number }> = {};
      order.items.forEach((item) => {
        const key = `${item.productId}-${item.size || ""}-${item.variant || ""}`;
        initial[key] = {
          checked: true,
          quantity: item.quantity,
        };
      });
      setItemReturns(initial);
      setReturnReason("Dissatisfied with product");
      setReturnDate(new Date().toISOString().split("T")[0]);
      setRefundAmount(order.totalPrice);
      setReturnNotes("");
      setIsStockRestored(true);
    }
  }, [isReturnModalOpen, order]);

  // Recalculate refund amount on checkboxes change
  useEffect(() => {
    if (!isReturnModalOpen || Object.keys(itemReturns).length === 0) return;

    let calculatedRefund = 0;
    let allItemsReturned = true;

    order.items.forEach((item) => {
      const key = `${item.productId}-${item.size || ""}-${item.variant || ""}`;
      const config = itemReturns[key];
      if (config && config.checked) {
        calculatedRefund += item.price * config.quantity;
        if (config.quantity < item.quantity) {
          allItemsReturned = false;
        }
      } else {
        allItemsReturned = false;
      }
    });

    if (allItemsReturned) {
      setRefundAmount(order.totalPrice);
    } else {
      setRefundAmount(calculatedRefund);
    }
  }, [itemReturns, isReturnModalOpen, order.items, order.totalPrice]);

  const handleConfirmReturn = async () => {
    const returnedItemsList = order.items
      .map((item) => {
        const key = `${item.productId}-${item.size || ""}-${item.variant || ""}`;
        const config = itemReturns[key];
        if (config && config.checked) {
          return {
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: config.quantity,
            size: item.size,
            variant: item.variant,
          };
        }
        return null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (returnedItemsList.length === 0) {
      showToast("Please select at least one item to return.", "error");
      return;
    }

    try {
      await returnOrder(order.id, {
        returnReason,
        returnDate,
        refundAmount,
        returnNotes,
        isStockRestored,
        returnedItems: returnedItemsList,
      });

      setIsReturnModalOpen(false);

      if (onUpdateLocalOrder) {
        onUpdateLocalOrder({
          ...order,
          status: "Returned",
          returnReason,
          returnDate,
          refundAmount,
          returnNotes,
          isStockRestored,
          returnedItems: returnedItemsList,
        });
      }
      onClose();
    } catch (e) {
      // toast handles errors inside the action
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress || !shippingCity) {
      showToast("All customer and shipping fields are required.", "error");
      return;
    }
    setIsSaving(true);
    try {
      await api.orders.updateDetails({
        id: order.id,
        customerName,
        customerPhone,
        shippingAddress,
        shippingCity,
      });
      showToast("Order details updated successfully!", "success");
      setIsEditing(false);
      if (onUpdateLocalOrder) {
        onUpdateLocalOrder({
          ...order,
          customerName,
          customerPhone,
          customerAddress: shippingAddress,
          customerCity: shippingCity,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update order details";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-text hover:text-gray-800"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="flex justify-between items-center border-b border-border-color pb-3 mb-5">
          <h2 className="text-base font-black uppercase tracking-wider text-white">
            Order Details: {order.orderName || order.id}
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-4xs font-black uppercase tracking-widest text-primary-coral hover:underline cursor-pointer"
            >
              Edit Details
              <Icon name="edit" size={10} />
            </button>
          )}
        </div>

        {/* Client Address Info / Form */}
        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="grid grid-cols-2 gap-4 text-xs mb-6 animate-fade-in">
            <div className="col-span-2">
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Shipping City/Governorate *
              </label>
              <input
                type="text"
                required
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Shipping Address *
              </label>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full h-16 rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral resize-none"
              />
            </div>
            <div className="col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-full bg-primary-coral py-2.5 text-3xs font-black tracking-widest text-main-bg hover:bg-white transition-all duration-300 uppercase cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "SAVING..." : "SAVE DETAILS"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCustomerName(order.customerName);
                  setCustomerPhone(order.customerPhone);
                  setShippingAddress(order.customerAddress);
                  setShippingCity(order.customerCity);
                }}
                className="flex-1 rounded-full border border-border-color bg-surface-deep/60 py-2.5 text-3xs font-black tracking-widest text-white hover:border-primary-coral transition-all duration-300 uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Customer Name
              </span>
              <span className="font-bold text-white">{order.customerName}</span>
            </div>
            <div>
              <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Contact Phone
              </span>
              <span className="font-bold text-white">{order.customerPhone}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Shipping Destination
              </span>
              <span className="font-bold text-white">
                {order.customerAddress}, {order.customerCity}
              </span>
            </div>
            <div>
              <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Payment Method
              </span>
              <span className="font-bold text-white uppercase">
                {order.paymentMethod}
              </span>
            </div>
            <div>
              <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                Delivery Method
              </span>
              <span className="font-bold text-white uppercase">
                {order.shippingMethod}
              </span>
            </div>
            {order.notes && (
              <div className="col-span-2 bg-surface-deep p-3 border border-border-color rounded-xl">
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-primary-coral mb-1">
                  Customer Delivery Notes
                </span>
                <p className="italic text-muted-text text-3xs leading-relaxed">
                  "{order.notes}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Products grid */}
        <h4 className="text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-3">
          Formulations Ordered
        </h4>
        <div className="flex flex-col gap-2 mb-6 max-h-40 overflow-y-auto pr-1">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.size || ""}-${item.variant || ""}`}
              className="flex items-center justify-between border-b border-border-color/30 pb-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
                  ) : (
                    <ProductImage
                      color={item.imageColor}
                      type={item.imageType}
                      glow={false}
                      className="h-8 w-full"
                    />
                  )}
                </div>
                <div>
                  <span className="font-bold text-white block truncate max-w-[150px]">
                    {item.productName}
                  </span>
                  <span className="text-4xs text-muted-text uppercase font-semibold">
                    Qty: {item.quantity}
                    {item.size && ` • Size: ${item.size}`}
                    {item.variant && ` • Flavor: ${item.variant}`}
                  </span>
                </div>
              </div>
              <span className="font-bold text-white text-right flex flex-col items-end">
                <span>{(item.price * item.quantity).toLocaleString()} EGP</span>
                <span className="text-4xs text-muted-text font-normal">({item.price.toLocaleString()} EGP each)</span>
              </span>
            </div>
          ))}
        </div>

        {/* Calculations summaries */}
        <div className="flex flex-col gap-2 border-t border-border-color pt-4 text-xs text-white mb-6">
          <div className="flex justify-between">
            <span>Coupons Discount</span>
            <span className="text-success-green">
              -{order.discountAmount.toLocaleString()} EGP
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping cost</span>
            <span>{order.shippingCost.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between font-bold text-white text-sm border-t border-border-color/30 pt-2">
            <span>Total Amount Charged</span>
            <span className="text-primary-coral">
              {order.totalPrice.toLocaleString()} EGP
            </span>
          </div>
        </div>

        {/* Actions workflow */}
        <div className="flex flex-wrap gap-2 justify-end border-t border-border-color pt-4">
          {/* Order Status updates */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
              Change status:
            </span>
            <select
              value={order.status}
              disabled={isEditing}
              onChange={(e) => {
                const newStatus = e.target.value as Order["status"];
                updateOrderStatus(order.id, newStatus);
                if (onUpdateLocalOrder) {
                  onUpdateLocalOrder({ ...order, status: newStatus });
                }
              }}
              className="rounded-lg border border-border-color bg-surface-deep px-2.5 py-1 text-3xs font-bold text-white uppercase disabled:opacity-50"
            >
              <option value="New Order">New Order</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Shipped / Out for Delivery">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {order.status !== "Returned" && order.status !== "Cancelled" && order.status !== "Rejected" && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="rounded-full bg-primary-coral px-5 py-2.5 text-2xs font-extrabold text-main-bg hover:bg-white transition-all cursor-pointer"
            >
              MARK AS RETURNED
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-full border border-border-color bg-surface-deep px-5 py-2.5 text-2xs font-extrabold text-white hover:text-gray-800"
          >
            CLOSE LEDGER
          </button>
        </div>
      </div>

      {/* Mark as Returned Modal Overlay */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl animate-slide-in relative text-left">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-gray-800"
            >
              <Icon name="close" size={20} />
            </button>

            <h3 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-4">
              Mark Order as Returned
            </h3>

            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-3xs font-semibold leading-relaxed mb-4">
              ⚠️ Are you sure you want to mark this order as returned? This will reverse the order amount from sales and profit.
            </div>

            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1">
              {/* Items selection for partial returns */}
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Select items to return (Partial Return)
                </label>
                <div className="flex flex-col gap-2 bg-surface-deep/40 border border-border-color/30 rounded-xl p-3">
                  {order.items.map((item) => {
                    const key = `${item.productId}-${item.size || ""}-${item.variant || ""}`;
                    const config = itemReturns[key] || { checked: true, quantity: item.quantity };
                    return (
                      <div key={key} className="flex items-center justify-between gap-3 border-b border-border-color/20 last:border-0 pb-2 last:pb-0">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white shrink-0">
                          <input
                            type="checkbox"
                            checked={config.checked}
                            onChange={(e) => {
                              setItemReturns(prev => ({
                                ...prev,
                                [key]: { ...config, checked: e.target.checked }
                              }));
                            }}
                            className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                          />
                          <span className="truncate max-w-[150px]">{item.productName}</span>
                          <span className="text-4xs text-muted-text uppercase">({item.size} {item.variant})</span>
                        </label>
                        
                        {config.checked && (
                          <div className="flex items-center gap-2">
                            <span className="text-4xs text-muted-text uppercase font-bold">Qty:</span>
                            <select
                              value={config.quantity}
                              onChange={(e) => {
                                setItemReturns(prev => ({
                                  ...prev,
                                  [key]: { ...config, quantity: parseInt(e.target.value) || 1 }
                                }));
                              }}
                              className="rounded-lg border border-border-color bg-surface-deep px-2 py-0.5 text-3xs font-bold text-white uppercase focus:outline-none"
                            >
                              {Array.from({ length: item.quantity }, (_, i) => i + 1).map((q) => (
                                <option key={q} value={q}>{q}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    Refund Amount (EGP)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => handleRefundChange(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Return Reason
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                >
                  <option value="Dissatisfied with product">Dissatisfied with product</option>
                  <option value="Damaged / Defective product">Damaged / Defective product</option>
                  <option value="Incorrect item sent">Incorrect item sent</option>
                  <option value="Delayed delivery">Delayed delivery</option>
                  <option value="Customer changed mind">Customer changed mind</option>
                  <option value="Other / Customer Service return">Other / Customer Service return</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Notes / Details
                </label>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Describe return state..."
                  className="w-full h-16 rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text mt-1">
                <input
                  type="checkbox"
                  checked={isStockRestored}
                  onChange={(e) => setIsStockRestored(e.target.checked)}
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                />
                Restore returned items to inventory stock
              </label>
            </div>

            <div className="flex gap-3 mt-6 border-t border-border-color pt-4">
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="flex-1 rounded-full bg-primary-coral py-3 text-3xs font-black tracking-widest text-main-bg hover:bg-white transition-all cursor-pointer uppercase"
              >
                Confirm Return
              </button>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="flex-1 rounded-full border border-border-color bg-surface-deep/60 py-3 text-3xs font-black tracking-widest text-white hover:border-primary-coral transition-all cursor-pointer uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
