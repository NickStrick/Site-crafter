'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '@/lib/adminClient';
import { getSiteId } from '@/lib/siteId';
import type { OrderRecord } from '@/types/orders';

type OrdersModalProps = {
  onClose: () => void;
};

const STATUS_OPTIONS = ['PLACED', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED'];

function formatMoney(total: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(total);
  } catch {
    return `${total.toFixed(2)} ${currency}`;
  }
}

function toISOStart(dateStr: string) {
  if (!dateStr) return '';
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
}

function toISOEnd(dateStr: string) {
  if (!dateStr) return '';
  return new Date(`${dateStr}T23:59:59.999Z`).toISOString();
}

export default function OrdersModal({ onClose }: OrdersModalProps) {
  const businessId = getSiteId();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<string>('PLACED');
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = useCallback(
    async (opts?: { next?: string; append?: boolean }) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        qs.set('businessId', businessId);
        const fromISO = toISOStart(fromDate);
        const toISO = toISOEnd(toDate);
        if (fromISO) qs.set('from', fromISO);
        if (toISO) qs.set('to', toISO);
        qs.set('limit', '25');
        if (opts?.next) qs.set('next', opts.next);

        const res = await adminFetch(`/api/admin/orders?${qs.toString()}`);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `Request failed (${res.status})`);
        }
        const data = (await res.json()) as { items: OrderRecord[]; nextToken?: string | null };
        setOrders((prev) => (opts?.append ? [...prev, ...(data.items || [])] : data.items || []));
        setNextToken(data.nextToken || null);
      } catch (err) {
        setError((err as Error).message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    },
    [businessId, fromDate, toDate]
  );

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter && (order.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (!term) return true;
      return (
        (order.customerEmail || '').toLowerCase().includes(term) ||
        (order.orderId || '').toLowerCase().includes(term)
      );
    });
  }, [orders, search, statusFilter]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.createdAtOrderId === selectedId) || null,
    [orders, selectedId]
  );

  useEffect(() => {
    if (!selectedOrder) return;
    setStatusDraft(selectedOrder.status || 'PLACED');
  }, [selectedOrder]);

  async function handleUpdateStatus() {
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      const res = await adminFetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          createdAtOrderId: selectedOrder.createdAtOrderId,
          status: statusDraft,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed (${res.status})`);
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.createdAtOrderId === selectedOrder.createdAtOrderId
            ? { ...order, status: statusDraft }
            : order
        )
      );
    } catch (err) {
      setError((err as Error).message || 'Failed to update status.');
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDelete(order: OrderRecord) {
    if (!confirm(`Delete order ${order.orderId}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          createdAtOrderId: order.createdAtOrderId,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed (${res.status})`);
      }
      setOrders((prev) =>
        prev.filter((o) => o.createdAtOrderId !== order.createdAtOrderId)
      );
      if (selectedId === order.createdAtOrderId) setSelectedId(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete order.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[11000] bg-black/50 flex items-center justify-center p-4">
      <div className="card admin-card card-full card-solid w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <div className="text-lg font-semibold">Orders</div>
            <div className="text-sm opacity-70">Business: {businessId}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="px-5 py-4 border-b border-white/10 flex flex-wrap gap-3 items-end">
          <label className="text-sm">
            <div className="opacity-70">From</div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="text-sm">
            <div className="opacity-70">To</div>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="text-sm">
            <div className="opacity-70">Status</div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm flex-1 min-w-[220px]">
            <div className="opacity-70">Search</div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email or Order ID"
              className="input w-full"
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={() => fetchOrders()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>
          {nextToken && (
            <button
              className="btn btn-inverted"
              onClick={() => fetchOrders({ next: nextToken, append: true })}
              disabled={loading}
            >
              Load More
            </button>
          )}
        </div>

        {error && (
          <div className="px-5 py-3 text-sm text-red-300 border-b border-white/10">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left sticky top-0 bg-[var(--panel)]/90 backdrop-blur border-b border-white/10">
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Fulfillment</th>
                <th className="py-2 px-3">Delivery Address</th>
                <th className="py-2 px-3">Items</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.createdAtOrderId}
                  className={`border-b border-white/10 hover:bg-white/5 ${
                    selectedId === order.createdAtOrderId ? 'bg-white/5' : ''
                  }`}
                >
                  <td className="py-2 px-3">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs">{order.orderId}</td>
                  <td className="py-2 px-3">{order.customerName || '-'}</td>
                  <td className="py-2 px-3">{order.customerEmail}</td>
                  <td className="py-2 px-3">
                    {formatMoney(order.total, order.currency)}
                  </td>
                  <td className="py-2 px-3">{order.status}</td>
                  <td className="py-2 px-3">
                    {order.fulfillment || order.delivery?.fulfillment || '-'}
                  </td>
                  <td className="py-2 px-3 max-w-[220px] truncate">
                    {(order.fulfillment || order.delivery?.fulfillment) === 'delivery'
                      ? order.deliveryAddress || order.delivery?.address || '-'
                      : '-'}
                  </td>
                  <td className="py-2 px-3">{order.items?.length ?? 0}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelectedId(order.createdAtOrderId)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelectedId(order.createdAtOrderId)}
                    >
                      Update Status
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => void handleDelete(order)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredOrders.length && !loading && (
                <tr>
                  <td className="py-6 px-3 text-center opacity-70" colSpan={10}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          {selectedOrder ? (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Order Details</div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close order details"
                  >
                    Hide Details
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-semibold mb-2">Items</div>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div
                        key={`${selectedOrder.orderId}-${idx}`}
                        className="grid grid-cols-[1.4fr_auto_auto] gap-3 items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-base font-semibold truncate">
                            {item.name || `Item ${idx + 1}`}
                          </div>
                          {item.sku && (
                            <div className="text-xs opacity-70">SKU: {item.sku}</div>
                          )}
                        </div>
                        <div className="text-sm opacity-80">
                          Qty: {item.quantity ?? '-'}
                        </div>
                        <div className="text-sm font-semibold">
                          {typeof item.total === 'number'
                            ? formatMoney((item.total), selectedOrder.currency)
                            : typeof item.price === 'number' && typeof item.quantity === 'number'
                            ? formatMoney(((item.price * item.quantity)), selectedOrder.currency)
                            : '-'}
                        </div>
                      </div>
                    ))}
                    {!selectedOrder.items?.length && (
                      <div className="opacity-70">No items.</div>
                    )}
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    {typeof selectedOrder.taxes?.taxCents === 'number' && (
                      <div className="flex justify-between border-t border-white/10 pt-2">
                        <span className="opacity-80">Tax</span>
                        <span className="font-semibold">
                          {formatMoney(selectedOrder.taxes.taxCents / 100, selectedOrder.currency)}
                        </span>
                      </div>
                    )}
                    {typeof selectedOrder.delivery?.flatFeeCents === 'number' && (
                      <div className="flex justify-between">
                        <span className="opacity-80">Shipping</span>
                        <span className="font-semibold">
                          {formatMoney(
                            selectedOrder.delivery.flatFeeCents / 100,
                            selectedOrder.currency
                          )}
                        </span>
                      </div>
                    )}
                    {typeof selectedOrder.taxes?.totalCents === 'number' && (
                      <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold">
                        <span>Total</span>
                        <span>
                          {formatMoney(
                            selectedOrder.taxes.totalCents / 100,
                            selectedOrder.currency
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 mb-2">
                    <div className="text-xs uppercase tracking-wide opacity-70">Important info</div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">
                          {selectedOrder.customerName || 'No name'}
                        </div>
                        <div className="text-sm font-semibold">
                          {selectedOrder.customerEmail}
                        </div>
                      </div>
                      <div className="text-right text-sm font-semibold">
                        <div>
                          {(selectedOrder.fulfillment || selectedOrder.delivery?.fulfillment) ===
                          'delivery'
                            ? <><span className="underline mr-2"> Deilver to:</span>{selectedOrder.deliveryAddress ||
                              selectedOrder.delivery?.address ||
                              'No address'}</>
                            : 'Pickup order'}
                        </div>
                        <div className="opacity-80">
                          <span className="underline mr-2">Received:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>Status: {selectedOrder.status}</div>
                  <div>Order ID: <span className="font-mono">{selectedOrder.orderId}</span></div>
                  
                  {selectedOrder.notes && <div>Notes: {selectedOrder.notes}</div>}
                </div>
              </div>
              <div className="space-y-3">
                <div className="font-semibold">Update Status</div>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                  className="select w-full"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => void handleUpdateStatus()}
                  disabled={savingStatus}
                >
                  {savingStatus ? 'Saving...' : 'Save Status'}
                </button>
                <button
                  className="btn btn-inverted w-full"
                  onClick={() => void handleDelete(selectedOrder)}
                  disabled={deleting}
                >
                  Delete Order
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm opacity-70">Select an order to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
