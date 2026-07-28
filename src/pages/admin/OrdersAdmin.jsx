import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrdersThunk, updateOrderStatusThunk } from '../../redux/slices/orderSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { ShoppingBag, Eye, RefreshCw } from 'lucide-react';

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const adminOrders = useSelector((state) => state.orders.adminOrders);

  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchUserOrdersThunk({ userId: null, isAdmin: true }));
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    await dispatch(updateOrderStatusThunk({ orderId, newStatus }));
    dispatch(showToast({ message: `Order #${orderId} status changed to ${newStatus}`, type: 'success' }));
  };

  const filteredOrders = statusFilter === 'all' 
    ? adminOrders 
    : adminOrders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Orders Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor fulfillment queue, view receipts, & update shipment statuses
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">Filter All Statuses</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{order.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress?.fullName || 'Customer'}</p>
                    <span className="text-[10px] text-slate-400">{order.userEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4">{order.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status || 'Placed'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${getOrderStatusBadge(order.status)}`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OrdersAdmin;
