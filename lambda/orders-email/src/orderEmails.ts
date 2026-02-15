type OrderItemLike = {
  name?: unknown;
  quantity?: unknown;
  price?: unknown;
  total?: unknown;
};

export type OrderLike = {
  businessId?: unknown;
  createdAtOrderId?: unknown;
  orderId?: unknown;
  createdAt?: unknown;
  customerEmail?: unknown;
  customerName?: unknown;
  items?: unknown;
  total?: unknown;
  currency?: unknown;
  businessDisplayName?: unknown;
  businessNotificationEmail?: unknown;
};

export type BuiltEmail = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function s(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function n(value: unknown): number {
  return typeof value === 'number' ? value : Number.NaN;
}

function normalizeItems(value: unknown): OrderItemLike[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x) => !!x && typeof x === 'object') as OrderItemLike[];
}

function formatMoney(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) return '';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return String(amount);
  }
}

function renderItems(items: OrderItemLike[], currency: string): string {
  if (!items.length) return '<p>(No items)</p>';
  const rows = items
    .map((item) => {
      const name = escapeHtml(s(item.name).trim() || 'Item');
      const qty = typeof item.quantity === 'number' && Number.isFinite(item.quantity) ? item.quantity : 1;
      const lineTotal =
        typeof item.total === 'number' && Number.isFinite(item.total)
          ? item.total
          : typeof item.price === 'number' && Number.isFinite(item.price)
            ? item.price * qty
            : Number.NaN;
      const money = Number.isFinite(lineTotal) ? escapeHtml(formatMoney(lineTotal, currency)) : '';
      return `<li><strong>${name}</strong> × ${qty}${money ? ` — ${money}` : ''}</li>`;
    })
    .join('');
  return `<ul>${rows}</ul>`;
}

export function buildCustomerEmail(params: {
  order: OrderLike;
  emailFrom: string;
}): BuiltEmail | null {
  const { order, emailFrom } = params;

  const to = s(order.customerEmail).trim();
  const replyTo = s(order.businessNotificationEmail).trim();
  const displayName = s(order.businessDisplayName).trim() || 'Sapling Sites';
  const from = `${displayName} <${emailFrom}>`;

  if (!to || !replyTo) return null;

  const orderId = s(order.orderId).trim();
  const currency = (s(order.currency).trim() || 'USD').toUpperCase();
  const items = normalizeItems(order.items);
  const total = n(order.total);

  const subject = 'Your order is confirmed 🎉';
  const html = [
    `<h2>Thank you for your order!</h2>`,
    `<p>We’ve received your order and it’s confirmed.</p>`,
    orderId ? `<p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>` : '',
    `<h3>Items</h3>`,
    renderItems(items, currency),
    Number.isFinite(total) ? `<p><strong>Total:</strong> ${escapeHtml(formatMoney(total, currency))}</p>` : '',
    `<p>If you have questions, contact us at <a href="mailto:${escapeHtml(replyTo)}">${escapeHtml(replyTo)}</a>.</p>`,
  ]
    .filter(Boolean)
    .join('\n');

  return { to, from, replyTo, subject, html };
}

export function buildBusinessEmail(params: {
  order: OrderLike;
  emailFrom: string;
}): BuiltEmail | null {
  const { order, emailFrom } = params;

  const to = s(order.businessNotificationEmail).trim();
  if (!to) return null;

  const orderId = s(order.orderId).trim();
  const createdAt = s(order.createdAt).trim();
  const customerName = s(order.customerName).trim();
  const customerEmail = s(order.customerEmail).trim();
  const currency = (s(order.currency).trim() || 'USD').toUpperCase();
  const items = normalizeItems(order.items);
  const total = n(order.total);

  const subject = `New Order Received – ${orderId || 'Unknown Order'}`;
  const html = [
    `<h2>New order received</h2>`,
    customerName ? `<p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>` : '',
    customerEmail ? `<p><strong>Customer email:</strong> ${escapeHtml(customerEmail)}</p>` : '',
    orderId ? `<p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>` : '',
    `<h3>Items</h3>`,
    renderItems(items, currency),
    Number.isFinite(total) ? `<p><strong>Total:</strong> ${escapeHtml(formatMoney(total, currency))}</p>` : '',
    createdAt ? `<p><strong>Created:</strong> ${escapeHtml(createdAt)}</p>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    to,
    from: `New Order <${emailFrom}>`,
    replyTo: to,
    subject,
    html,
  };
}

