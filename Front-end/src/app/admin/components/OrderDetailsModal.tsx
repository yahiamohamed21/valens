import React from "react";
import { Order } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-text hover:text-white"
        >
          <Icon name="close" size={20} />
        </button>

        <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
          Order Details: {order.id}
        </h2>

        {/* Client address summary */}
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

        {/* Products grid */}
        <h4 className="text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-3">
          Formulations Ordered
        </h4>
        <div className="flex flex-col gap-2 mb-6 max-h-40 overflow-y-auto pr-1">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.variant}`}
              className="flex items-center justify-between border-b border-border-color/30 pb-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0">
                  <ProductImage
                    color={item.imageColor}
                    type={item.imageType}
                    glow={false}
                    className="h-8 w-full"
                  />
                </div>
                <div>
                  <span className="font-bold text-white block truncate max-w-[150px]">
                    {item.productName}
                  </span>
                  <span className="text-4xs text-muted-text uppercase font-semibold">
                    Qty: {item.quantity} • {item.variant} • {item.size}
                  </span>
                </div>
              </div>
              <span className="font-bold text-soft-text">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Calculations summaries */}
        <div className="flex flex-col gap-2 border-t border-border-color pt-4 text-xs text-soft-text mb-6">
          <div className="flex justify-between">
            <span>Coupons Discount</span>
            <span className="text-success-green">
              -${order.discountAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping cost</span>
            <span>${order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-white text-sm border-t border-border-color/30 pt-2">
            <span>Total Amount Charged</span>
            <span className="text-primary-coral">
              ${order.totalPrice.toFixed(2)}
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
              onChange={(e) => {
                const newStatus = e.target.value as Order["status"];
                updateOrderStatus(order.id, newStatus);
                if (onUpdateLocalOrder) {
                  onUpdateLocalOrder({ ...order, status: newStatus });
                }
              }}
              className="rounded-lg border border-border-color bg-surface-deep px-2.5 py-1 text-3xs font-bold text-white uppercase"
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

          <button
            onClick={onClose}
            className="rounded-full border border-border-color bg-surface-deep px-5 py-2.5 text-2xs font-extrabold text-soft-text hover:text-white"
          >
            CLOSE LEDGER
          </button>
        </div>
      </div>
    </div>
  );
};
