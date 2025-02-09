function generateInvoiceHTML(order) {
    const invoiceNumber = `INV-${String(order.id).padStart(6, '0')}`;
    const currentDate = new Date(order.date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return `
        <style>
            .invoice-container {
                padding: 30px;
                max-width: 700px;
                margin: auto;
                font-size: 12px;
                line-height: 1.5;
            }
            .header-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding-bottom: 15px;
                border-bottom: 1px solid #ddd;
            }
            .company-info {
                color: #666;
                line-height: 1.4;
            }
            .company-name {
                font-size: 18px;
                color: #333;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .invoice-title {
                font-size: 24px;
                color: #1a56db;
                font-weight: bold;
                text-align: right;
            }
            .logo {
                height: 40px;
                margin-bottom: 10px;
            }
            .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                border: 1px solid #ddd;
                margin-bottom: 20px;
                font-size: 11px;
            }
            .details-grid > div {
                padding: 10px;
                border-bottom: 1px solid #eee;
            }
            .details-label {
                color: #666;
                margin-bottom: 3px;
            }
            .details-value {
                font-weight: 600;
                color: #333;
            }
            .address-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
                font-size: 11px;
            }
            .address-title {
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
                font-size: 12px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 11px;
            }
            th {
                background: #1a56db;
                color: white;
                text-align: left;
                padding: 8px;
                font-size: 11px;
            }
            td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
            .amount-column {
                text-align: right;
            }
            .item-description {
                color: #666;
                font-size: 10px;
                margin-top: 3px;
            }
            .totals-section {
                margin-left: auto;
                width: 250px;
                font-size: 11px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
            }
            .total-row.final {
                font-weight: bold;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 8px;
                margin-top: 5px;
            }
            .terms-section {
                margin-top: 30px;
                color: #666;
                font-size: 10px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            .terms-title {
                font-weight: 600;
                margin: 8px 0;
                color: #333;
            }
            .payment-method {
                display: inline-block;
                background: #f0f4ff;
                padding: 4px 8px;
                border-radius: 4px;
                color: #1a56db;
                font-weight: 600;
                margin: 8px 0;
                font-size: 11px;
            }
            @media print {
                .invoice-container {
                    padding: 0;
                }
            }
        </style>
        <div class="invoice-container">
            <div class="header-section">
                <div>
                    <img src="${localStorage.getItem('siteLogoUrl') || 'https://i.ibb.co/VvxBzzg/Co-Slim.png'}" 
                         alt="CoSlim Logo" 
                         class="logo">
                    <div class="company-name">CoSlim Mobile Accessories</div>
                    <div class="company-info">
                        Bhandaridih<br>
                        Giridih 815301<br>
                        Jharkhand, India<br>
                        Email: support@coslim.com
                    </div>
                </div>
                <div>
                    <div class="invoice-title">INVOICE</div>
                    <div class="order-id">Order ID: #${order.id}</div>
                </div>
            </div>

            <div class="details-grid">
                <div>
                    <div class="details-label">Invoice#</div>
                    <div class="details-value">${invoiceNumber}</div>
                </div>
                <div>
                    <div class="details-label">Invoice Date</div>
                    <div class="details-value">${currentDate}</div>
                </div>
                <div>
                    <div class="details-label">Payment Method</div>
                    <div class="details-value">${order.paymentMethod || 'Cash on Delivery'}</div>
                </div>
                <div>
                    <div class="details-label">Due Date</div>
                    <div class="details-value">${currentDate}</div>
                </div>
            </div>

            <div class="address-section">
                <div>
                    <div class="address-title">Bill To</div>
                    <div class="address-content">
                        <strong>${order.shippingAddress.fullName}</strong><br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}<br>
                        ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
                        Phone: ${order.shippingAddress.phone}<br>
                        Email: ${order.userEmail}
                    </div>
                </div>
                <div>
                    <div class="address-title">Ship To</div>
                    <div class="address-content">
                        <strong>${order.shippingAddress.fullName}</strong><br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}<br>
                        ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
                        Phone: ${order.shippingAddress.phone}
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item & Description</th>
                        <th>Qty</th>
                        <th class="amount-column">Rate</th>
                        <th class="amount-column">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.products.map((item, index) => {
                        const product = SHOP_DATA.products.find(p => p.id === item.productId);
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    ${product?.name || 'Product Not Found'}
                                    <div class="item-description">
                                        ${product?.description || ''}<br>
                                        Brand: ${product?.brand || ''}<br>
                                        Model: ${product?.model || ''}
                                    </div>
                                </td>
                                <td>${item.quantity.toFixed(2)}</td>
                                <td class="amount-column">INR ${item.price.toFixed(2)}</td>
                                <td class="amount-column">INR ${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="totals-section">
                <div class="total-row">
                    <div>Sub Total</div>
                    <div>INR ${order.total.toFixed(2)}</div>
                </div>
                <div class="total-row">
                    <div><strong>Total Amount</strong></div>
                    <div><strong>INR ${order.total.toFixed(2)}</strong></div>
                </div>
                <div class="total-row">
                    <div><strong>Balance Due</strong></div>
                    <div><strong>INR ${order.total.toFixed(2)}</strong></div>
                </div>
            </div>

            <div class="terms-section">
                <div>Thanks for shopping with us.</div>
                <div class="payment-method">Payment Method: ${order.paymentMethod || 'Cash on Delivery'}</div>
                <div class="terms-title">Terms & Conditions</div>
                <div>
                    1. Full payment is due upon receipt of this invoice.<br>
                    2. Payment should be made through the specified payment method.<br>
                    3. Late payments may incur additional charges or interest.<br>
                    4. All prices are inclusive of all taxes.<br>
                    5. Returns and refunds are subject to our return policy.
                </div>
            </div>
        </div>
    `;
}

// Update the invoice when the page loads
if (typeof order !== 'undefined' && order) {
    document.getElementById('invoiceContainer').innerHTML = generateInvoiceHTML(order);
} 