class AdminPanel {
    constructor() {
        this.currentAdmin = null;
        this.init();
        console.log('AdminPanel initialized');
    }

    init() {
        console.log('Initializing admin panel...');
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            console.log('Login form found');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
            });
        } else {
            console.error('Login form not found');
        }
    }

    handleLogin() {
        const emailInput = document.getElementById('adminEmail');
        const passwordInput = document.getElementById('adminPassword');

        if (!emailInput || !passwordInput) {
            console.error('Login inputs not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            this.showNotification('Please enter both email and password', 'error');
            return;
        }

        // Check if email and password match admin credentials
        const admin = ADMIN_USERS.find(user => user.email === email && user.password === password);

        if (admin) {
            this.currentAdmin = admin;
            this.showNotification('Login successful!', 'success');
            this.showDashboard();
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    showDashboard() {
        try {
            const loginScreen = document.getElementById('loginScreen');
            const adminDashboard = document.getElementById('adminDashboard');
            
            if (!loginScreen || !adminDashboard) {
                throw new Error('Required elements not found');
            }

            loginScreen.classList.add('hidden');
            adminDashboard.classList.remove('hidden');

            // Load dashboard content
            const adminContent = document.getElementById('adminContent');
            if (adminContent) {
                adminContent.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white p-6 rounded-lg shadow-md admin-card">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500">Total Products</p>
                                    <h3 class="text-2xl font-bold">${SHOP_DATA.products.length}</h3>
                                </div>
                                <div class="bg-blue-100 p-3 rounded-full">
                                    <i class="fas fa-box text-blue-600"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md admin-card">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500">Total Users</p>
                                    <h3 class="text-2xl font-bold">${USERS.length}</h3>
                                </div>
                                <div class="bg-green-100 p-3 rounded-full">
                                    <i class="fas fa-users text-green-600"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md admin-card">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500">Categories</p>
                                    <h3 class="text-2xl font-bold">${SHOP_DATA.categories.length}</h3>
                                </div>
                                <div class="bg-purple-100 p-3 rounded-full">
                                    <i class="fas fa-th-large text-purple-600"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md admin-card">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500">Total Orders</p>
                                    <h3 class="text-2xl font-bold">0</h3>
                                </div>
                                <div class="bg-yellow-100 p-3 rounded-full">
                                    <i class="fas fa-shopping-cart text-yellow-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
                        <div class="space-y-4">
                            <p class="text-gray-600">No recent activity</p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error showing dashboard:', error);
            this.showNotification('Error loading dashboard', 'error');
        }
    }

    showProducts() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Products</h2>
                <a href="./add-product.html" 
                   class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-plus mr-2"></i>Add Product
                </a>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${SHOP_DATA.products.map(product => `
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${SHOP_DATA.categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</td>
                                <td>₹${product.price}</td>
                                <td>${product.stock}</td>
                                <td>
                                    <button onclick="admin.editProduct(${product.id})" class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="admin.deleteProduct(${product.id})" class="text-red-600 hover:text-red-800 ml-3">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        notification.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    logout() {
        this.currentAdmin = null;
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminLoginForm').reset();
    }

    showAddProductModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Add New Product</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="addProductForm" class="space-y-4">
                    <!-- Add Model Selection Section -->
                    <div class="border p-4 rounded-lg space-y-4">
                        <label class="block text-gray-700 mb-2">Phone Model</label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-500 text-sm mb-1">Brand</label>
                                <select name="brand" onchange="admin.updateSeriesList(this.value)" 
                                        class="w-full px-4 py-2 rounded-lg border">
                                    <option value="">Select Brand</option>
                                    ${Object.keys(PHONE_MODELS).map(brand => `
                                        <option value="${brand}">${brand}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-500 text-sm mb-1">Series</label>
                                <select name="series" onchange="admin.updateModelList(this.value)" 
                                        class="w-full px-4 py-2 rounded-lg border">
                                    <option value="">Select Series</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-500 text-sm mb-1">Model</label>
                            <select name="model" required class="w-full px-4 py-2 rounded-lg border">
                                <option value="">Select Model</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Product Name</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Category</label>
                        <select name="categoryId" required class="w-full px-4 py-2 rounded-lg border">
                            ${SHOP_DATA.categories.map(category => `
                                <option value="${category.id}">${category.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Price</label>
                        <input type="number" name="price" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Stock</label>
                        <input type="number" name="stock" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea name="description" required class="w-full px-4 py-2 rounded-lg border"></textarea>
                    </div>
                    <!-- Specifications Section -->
                    <div class="border p-4 rounded-lg">
                        <label class="block text-gray-700 mb-2">Specifications</label>
                        <div id="specificationsContainer" class="space-y-2">
                            <div class="flex gap-2">
                                <input type="text" name="specKey[]" placeholder="Key (e.g., Material)" 
                                       class="flex-1 px-4 py-2 rounded-lg border">
                                <input type="text" name="specValue[]" placeholder="Value (e.g., TPU + Polycarbonate)" 
                                       class="flex-1 px-4 py-2 rounded-lg border">
                                <button type="button" onclick="this.parentElement.remove()" 
                                        class="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" onclick="admin.addSpecificationField()" 
                                class="mt-2 text-blue-600 hover:text-blue-800">
                            <i class="fas fa-plus mr-1"></i>Add Specification
                        </button>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Image URLs (one per line)</label>
                        <p class="text-sm text-gray-500 mb-2">Recommended size: 800x800px for products, 1920x600px for banners</p>
                        <textarea name="images" required 
                                  class="w-full px-4 py-2 rounded-lg border" 
                                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddProduct(e.target);
        });
    }

    addSpecificationField() {
        const container = document.getElementById('specificationsContainer');
        const newField = document.createElement('div');
        newField.className = 'flex gap-2';
        newField.innerHTML = `
            <input type="text" name="specKey[]" placeholder="Key (e.g., Material)" 
                   class="flex-1 px-4 py-2 rounded-lg border">
            <input type="text" name="specValue[]" placeholder="Value (e.g., TPU + Polycarbonate)" 
                   class="flex-1 px-4 py-2 rounded-lg border">
            <button type="button" onclick="this.parentElement.remove()" 
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newField);
    }

    handleAddProduct(form) {
        // Get specifications
        const specKeys = Array.from(form.querySelectorAll('input[name="specKey[]"]')).map(input => input.value.trim());
        const specValues = Array.from(form.querySelectorAll('input[name="specValue[]"]')).map(input => input.value.trim());
        
        // Create specifications object
        const specifications = {
            ...Object.fromEntries(specKeys.map((key, index) => [key, specValues[index]])),
            brand: form.brand.value,
            series: form.series.value,
            model: form.model.value
        };

        // Find the highest existing product ID
        const maxId = Math.max(...SHOP_DATA.products.map(p => p.id), 0);
        
        const newProduct = {
            id: maxId + 1, // Generate new unique ID
            name: form.name.value,
            categoryId: parseInt(form.categoryId.value),
            price: parseFloat(form.price.value),
            stock: parseInt(form.stock.value),
            description: form.description.value,
            images: form.images.value.split('\n').filter(url => url.trim()),
            specifications: specifications,
            brand: form.brand.value,
            model: form.model.value
        };

        SHOP_DATA.products.push(newProduct);
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Product added successfully!');
        window.location.href = './admin.html'; // Update the redirect path
    }

    editProduct(productId) {
        const product = SHOP_DATA.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Edit Product</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="editProductForm" class="space-y-4">
                    <input type="hidden" name="productId" value="${product.id}">
                    <div>
                        <label class="block text-gray-700 mb-2">Product Name</label>
                        <input type="text" name="name" value="${product.name}" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Category</label>
                        <select name="categoryId" required class="w-full px-4 py-2 rounded-lg border">
                            ${SHOP_DATA.categories.map(category => `
                                <option value="${category.id}" ${category.id === product.categoryId ? 'selected' : ''}>
                                    ${category.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Price</label>
                        <input type="number" name="price" value="${product.price}" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Stock</label>
                        <input type="number" name="stock" value="${product.stock}" required class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea name="description" required class="w-full px-4 py-2 rounded-lg border">${product.description}</textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Image URLs (one per line)</label>
                        <textarea name="images" required class="w-full px-4 py-2 rounded-lg border">${product.images.join('\n')}</textarea>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('editProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditProduct(e.target);
        });
    }

    handleEditProduct(form) {
        const productId = parseInt(form.productId.value);
        const productIndex = SHOP_DATA.products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) return;

        SHOP_DATA.products[productIndex] = {
            ...SHOP_DATA.products[productIndex],
            name: form.name.value,
            categoryId: parseInt(form.categoryId.value),
            price: parseFloat(form.price.value),
            stock: parseInt(form.stock.value),
            description: form.description.value,
            images: form.images.value.split('\n').filter(url => url.trim()),
        };

        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Product updated successfully!');
        this.closeModal();
        this.showProducts();
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                // Remove product from SHOP_DATA
                SHOP_DATA.products = SHOP_DATA.products.filter(p => p.id !== productId);
                
                // Remove product from any existing orders
                window.ORDERS = window.ORDERS.map(order => ({
                    ...order,
                    products: order.products.filter(p => p.productId !== productId)
                }));

                // Save changes to localStorage
                saveToLocalStorage();

                this.updateDataVersion();
                this.showNotification('Product deleted successfully!');
                this.showProducts();

                // Force reload the page to refresh all data
                window.location.reload();
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showNotification('Error deleting product', 'error');
            }
        }
    }

    showOrders() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">Orders</h2>
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${window.ORDERS.map(order => `
                                <tr>
                                    <td>#${order.id}</td>
                                    <td>${order.shippingAddress?.fullName || 'N/A'}</td>
                                    <td>${new Date(order.date).toLocaleDateString()}</td>
                                    <td>₹${order.total}</td>
                                    <td>
                                        <span class="status-badge status-${order.status.toLowerCase()}">
                                            ${order.status}
                                        </span>
                                    </td>
                                    <td class="space-x-2">
                                        <button onclick="admin.updateOrderStatus(${order.id})"
                                                class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="admin.viewInvoice(${order.id})"
                                                class="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                                            <i class="fas fa-file-invoice"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    updateOrderStatus(orderId) {
        const order = window.ORDERS.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Update Order Status</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="updateOrderForm" class="space-y-4">
                    <input type="hidden" name="orderId" value="${order.id}">
                    <div>
                        <label class="block text-gray-700 mb-2">Status</label>
                        <select name="status" class="w-full px-4 py-2 rounded-lg border">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('updateOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const status = e.target.status.value;
            order.status = status;
            saveToLocalStorage();
            this.updateDataVersion();
            this.showNotification('Order status updated successfully!');
            this.closeModal();
            this.showOrders();
        });
    }

    viewInvoice(orderId) {
        const order = window.ORDERS.find(o => o.id === orderId);
        if (!order) {
            this.showNotification('Order not found', 'error');
            return;
        }
        
        // Open invoice in a new window
        const width = 900;
        const height = 800;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        window.open(
            `invoice.html?id=${order.id}`,
            'Invoice',
            `width=${width},height=${height},top=${top},left=${left}`
        );
    }

    closeModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.add('hidden');
    }

    showUsers() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Users</h2>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Addresses</th>
                            <th>Orders</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${USERS.length > 0 ? USERS.map((user, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.name || 'N/A'}</td>
                                <td>${user.email}</td>
                                <td>${user.phone || 'N/A'}</td>
                                <td>${user.addresses ? user.addresses.length : 0} addresses</td>
                                <td>${window.ORDERS.filter(order => order.userEmail === user.email).length} orders</td>
                                <td>
                                    <button onclick="admin.showUserDetails(${index})" 
                                            class="text-blue-600 hover:text-blue-800 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="admin.deleteUser(${index})" 
                                            class="text-red-600 hover:text-red-800">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="7" class="text-center py-4">No users found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        `;
    }

    showUserDetails(userIndex) {
        const user = USERS[userIndex];
        const userOrders = window.ORDERS.filter(order => order.userEmail === user.email);
        
        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">User Details</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- User Information -->
                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 class="font-semibold mb-4">Personal Information</h3>
                        <div class="space-y-2">
                            <p><span class="font-medium">Name:</span> ${user.name || 'N/A'}</p>
                            <p><span class="font-medium">Email:</span> ${user.email}</p>
                            <p><span class="font-medium">Phone:</span> ${user.phone || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <!-- Addresses -->
                    <div>
                        <h3 class="font-semibold mb-4">Saved Addresses</h3>
                        <div class="space-y-4">
                            ${user.addresses?.length ? user.addresses.map(address => `
                                <div class="border rounded p-3">
                                    <p class="font-medium">${address.fullName}</p>
                                    <p>${address.address}</p>
                                    <p>${address.city}, ${address.postalCode}</p>
                                    <p>Phone: ${address.phone}</p>
                                </div>
                            `).join('') : '<p class="text-gray-500">No addresses saved</p>'}
                        </div>
                    </div>
                </div>
                
                <!-- Orders -->
                <div>
                    <h3 class="font-semibold mb-4">Order History</h3>
                    ${userOrders.length ? `
                        <table class="w-full">
                            <thead>
                                <tr>
                                    <th class="text-left">Order ID</th>
                                    <th class="text-left">Date</th>
                                    <th class="text-left">Total</th>
                                    <th class="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${userOrders.map(order => `
                                    <tr>
                                        <td>#${order.id}</td>
                                        <td>${order.date}</td>
                                        <td>₹${order.total}</td>
                                        <td>
                                            <span class="status-badge status-${order.status.toLowerCase()}">
                                                ${order.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p class="text-gray-500">No orders found</p>'}
                </div>
            </div>
        `;
    }

    deleteUser(userIndex) {
        const user = USERS[userIndex];
        if (confirm(`Are you sure you want to delete user ${user.name || user.email}?`)) {
            try {
                // Remove user's orders - use window.ORDERS instead of ORDERS
                window.ORDERS = window.ORDERS.filter(order => order.userEmail !== user.email);
                
                // Remove user
                USERS.splice(userIndex, 1);
                
                // Save changes
                saveToLocalStorage();
                
                // Update the view
                this.updateDataVersion();
                this.showNotification('User deleted successfully!');
                this.showUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                this.showNotification('Error deleting user', 'error');
            }
        }
    }

    showCustomization() {
        const adminContent = document.getElementById('adminContent');
        // Get saved values or use defaults
        const currentLogoUrl = localStorage.getItem('siteLogoUrl') || 'https://i.ibb.co/VvxBzzg/Co-Slim.png';
        const primaryColor = localStorage.getItem('primaryColor') || '#2563eb';
        const siteTitle = localStorage.getItem('siteTitle') || 'CoSlim | Mobile Accessories Shop';
        const footerText = localStorage.getItem('footerText') || '© 2024 CoSlim. All rights reserved.';
        
        adminContent.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <h2 class="text-2xl font-bold mb-6">Website Customization</h2>

                <!-- Logo Settings -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Logo Settings</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4">
                            <img src="${currentLogoUrl}" alt="Current Logo" class="h-12">
                            <div class="flex-1">
                                <input type="text" id="logoUrl" value="${currentLogoUrl}"
                                       class="w-full px-4 py-2 rounded-lg border">
                            </div>
                            <button onclick="admin.updateLogo()" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Update Logo
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Banner Management -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Banner Management</h3>
                        <button onclick="admin.addNewBanner()"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Add New Banner
                        </button>
                    </div>
                    <div class="space-y-4">
                        ${SHOP_DATA.banners.map((banner, index) => `
                            <div class="border rounded-lg p-4">
                                <div class="flex items-start space-x-4">
                                    <img src="${banner.image}" alt="Banner ${index + 1}" class="w-32 h-20 object-cover rounded">
                                    <div class="flex-1 space-y-2">
                                        <input type="text" value="${banner.title}" 
                                               onchange="admin.updateBannerTitle(${index}, this.value)"
                                               class="w-full px-4 py-2 rounded-lg border" placeholder="Banner Title">
                                        <input type="text" value="${banner.subtitle}"
                                               onchange="admin.updateBannerSubtitle(${index}, this.value)"
                                               class="w-full px-4 py-2 rounded-lg border" placeholder="Banner Subtitle">
                                        <input type="text" value="${banner.image}"
                                               onchange="admin.updateBannerImage(${index}, this.value)"
                                               class="w-full px-4 py-2 rounded-lg border" placeholder="Banner Image URL">
                                    </div>
                                    <button onclick="admin.deleteBanner(${index})"
                                            class="text-red-600 hover:text-red-800">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Site Settings -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Site Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Website Title</label>
                            <input type="text" id="siteTitle" value="${siteTitle}"
                                   class="w-full px-4 py-2 rounded-lg border">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Primary Color</label>
                            <div class="flex items-center space-x-2">
                                <input type="color" id="primaryColor" value="${primaryColor}"
                                       class="h-10 w-20">
                                <input type="text" value="${primaryColor}"
                                       class="w-32 px-4 py-2 rounded-lg border" 
                                       onchange="document.getElementById('primaryColor').value = this.value">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Footer Text</label>
                            <input type="text" id="footerText" value="${footerText}"
                                   class="w-full px-4 py-2 rounded-lg border">
                        </div>
                        <button onclick="admin.updateSiteSettings()"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Save Settings
                        </button>
                    </div>
                </div>

                <!-- Social Media Links -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Social Media Links</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Facebook</label>
                            <input type="url" id="facebookUrl" value="${localStorage.getItem('facebookUrl') || ''}"
                                   class="w-full px-4 py-2 rounded-lg border" placeholder="Facebook URL">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Instagram</label>
                            <input type="url" id="instagramUrl" value="${localStorage.getItem('instagramUrl') || ''}"
                                   class="w-full px-4 py-2 rounded-lg border" placeholder="Instagram URL">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Twitter</label>
                            <input type="url" id="twitterUrl" value="${localStorage.getItem('twitterUrl') || ''}"
                                   class="w-full px-4 py-2 rounded-lg border" placeholder="Twitter URL">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">YouTube</label>
                            <input type="url" id="youtubeUrl" value="${localStorage.getItem('youtubeUrl') || ''}"
                                   class="w-full px-4 py-2 rounded-lg border" placeholder="YouTube URL">
                        </div>
                    </div>
                    <button onclick="admin.updateSocialLinks()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Update Social Links
                    </button>
                </div>
            </div>
        `;
    }

    updateLogo() {
        const newLogoUrl = document.getElementById('logoUrl').value;
        if (!newLogoUrl) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        // Update logo URL in localStorage
        localStorage.setItem('siteLogoUrl', newLogoUrl);
        
        // Update all logo images on the current page
        document.querySelectorAll('img[alt="CoSlim Logo"], img[alt="Current Logo"]').forEach(img => {
            img.src = newLogoUrl;
        });
        
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Logo updated successfully!');
        
        // Force refresh of any open shop pages
        window.opener?.location.reload();
    }

    updateSiteSettings() {
        const siteTitle = document.getElementById('siteTitle').value;
        const primaryColor = document.getElementById('primaryColor').value;
        const footerText = document.getElementById('footerText').value;

        localStorage.setItem('siteTitle', siteTitle);
        localStorage.setItem('primaryColor', primaryColor);
        localStorage.setItem('footerText', footerText);

        document.title = siteTitle;
        this.updateDataVersion();
        this.showNotification('Site settings updated successfully!');
        window.opener?.location.reload();
    }

    updateSocialLinks() {
        const socialPlatforms = ['facebook', 'instagram', 'twitter', 'youtube'];
        
        socialPlatforms.forEach(platform => {
            const url = document.getElementById(`${platform}Url`).value;
            localStorage.setItem(`${platform}Url`, url);
        });

        this.updateDataVersion();
        this.showNotification('Social media links updated successfully!');
        window.opener?.location.reload();
    }

    showAddCategoryModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Add New Category</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="addCategoryForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Category Name</label>
                        <input type="text" name="name" required class="w-full p-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea name="description" required class="w-full p-2 border rounded"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Image URL</label>
                        <input type="url" name="image" required class="w-full p-2 border rounded">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Add Category
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.handleAddCategory(formData);
        });
    }

    handleAddCategory(formData) {
        const newCategory = {
            id: SHOP_DATA.categories.length + 1,
            name: formData.get('name'),
            description: formData.get('description'),
            image: formData.get('image')
        };

        SHOP_DATA.categories.push(newCategory);
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Category added successfully!');
        this.closeModal();
        this.showCustomization();
    }

    editCategory(categoryId) {
        const category = SHOP_DATA.categories.find(c => c.id === categoryId);
        if (!category) return;

        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Edit Category</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="editCategoryForm" class="space-y-4">
                    <input type="hidden" name="categoryId" value="${category.id}">
                    <div>
                        <label class="block text-gray-700 mb-2">Category Name</label>
                        <input type="text" name="name" value="${category.name}" required class="w-full p-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea name="description" required class="w-full p-2 border rounded">${category.description}</textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Image URL</label>
                        <input type="url" name="image" value="${category.image}" required class="w-full p-2 border rounded">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('editCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.handleEditCategory(formData);
        });
    }

    handleEditCategory(formData) {
        const categoryId = parseInt(formData.get('categoryId'));
        const categoryIndex = SHOP_DATA.categories.findIndex(c => c.id === categoryId);
        
        if (categoryIndex === -1) return;

        SHOP_DATA.categories[categoryIndex] = {
            ...SHOP_DATA.categories[categoryIndex],
            name: formData.get('name'),
            description: formData.get('description'),
            image: formData.get('image')
        };

        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Category updated successfully!');
        this.closeModal();
        this.showCustomization();
    }

    deleteCategory(categoryId) {
        if (SHOP_DATA.categories.length <= 1) {
            this.showNotification('Cannot delete the last category', 'error');
            return;
        }

        // Check if category has products
        const hasProducts = SHOP_DATA.products.some(p => p.categoryId === categoryId);
        if (hasProducts) {
            this.showNotification('Cannot delete category with existing products', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this category?')) {
            SHOP_DATA.categories = SHOP_DATA.categories.filter(c => c.id !== categoryId);
            saveToLocalStorage();
            this.updateDataVersion();
            this.showNotification('Category deleted successfully!');
            this.showCustomization();
        }
    }

    showProfileSettings() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <h2 class="text-2xl font-bold mb-8">Admin Settings</h2>
                
                <!-- Change Admin Password -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 class="text-lg font-semibold mb-4">Change Admin Password</h3>
                    <form id="changeAdminPasswordForm" onsubmit="admin.updateAdminPassword(event)" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Current Password</label>
                            <input type="password" name="currentPassword" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">New Password</label>
                            <input type="password" name="newPassword" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Confirm New Password</label>
                            <input type="password" name="confirmPassword" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" 
                                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Update Password
                        </button>
                    </form>
                </div>

                <!-- Create New Admin -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Create New Admin</h3>
                    <form id="createAdminForm" onsubmit="admin.createNewAdmin(event)" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Admin Name</label>
                            <input type="text" name="adminName" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Admin Email</label>
                            <input type="email" name="adminEmail" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Password</label>
                            <input type="password" name="adminPassword" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Confirm Password</label>
                            <input type="password" name="confirmAdminPassword" required
                                   class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" 
                                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                            Create Admin
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    updateAdminPassword(event) {
        event.preventDefault();
        const currentPassword = event.target.currentPassword.value;
        const newPassword = event.target.newPassword.value;
        const confirmPassword = event.target.confirmPassword.value;

        // Get admin user from USERS array
        const adminUser = USERS.find(u => u.isAdmin);
        if (!adminUser) {
            this.showNotification('Admin user not found', 'error');
            return;
        }

        // Verify current password
        if (adminUser.password !== currentPassword) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }

        // Verify new password match
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        // Update password in USERS array
        const userIndex = USERS.findIndex(u => u.isAdmin);
        if (userIndex !== -1) {
            USERS[userIndex].password = newPassword;
            
            // Save to localStorage
            saveToLocalStorage();

            // Update currentUser in localStorage if it exists
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.isAdmin) {
                currentUser.password = newPassword;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            this.showNotification('Admin password updated successfully');
            event.target.reset();
        } else {
            this.showNotification('Failed to update password', 'error');
        }
    }

    createNewAdmin(event) {
        event.preventDefault();
        const name = event.target.adminName.value;
        const email = event.target.adminEmail.value;
        const password = event.target.adminPassword.value;
        const confirmPassword = event.target.confirmAdminPassword.value;

        // Check if email already exists
        if (USERS.some(u => u.email === email)) {
            this.showNotification('Email already exists', 'error');
            return;
        }

        // Verify passwords match
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Create new admin user
        const newAdmin = {
            name,
            email,
            password,
            isAdmin: true,
            createdAt: new Date().toISOString()
        };

        // Add to USERS array
        USERS.push(newAdmin);
        saveToLocalStorage();

        this.showNotification('New admin created successfully');
        event.target.reset();
    }

    // Add these new methods to handle the cascading dropdowns
    updateSeriesList(brand) {
        const seriesSelect = document.querySelector('select[name="series"]');
        const modelSelect = document.querySelector('select[name="model"]');
        
        // Reset series and model dropdowns
        seriesSelect.innerHTML = '<option value="">Select Series</option>';
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        
        if (brand && PHONE_MODELS[brand]) {
            Object.keys(PHONE_MODELS[brand]).forEach(series => {
                seriesSelect.innerHTML += `<option value="${series}">${series}</option>`;
            });
        }
    }

    updateModelList(series) {
        const brand = document.querySelector('select[name="brand"]').value;
        const modelSelect = document.querySelector('select[name="model"]');
        
        // Reset model dropdown
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        
        if (brand && series && PHONE_MODELS[brand][series]) {
            PHONE_MODELS[brand][series].forEach(model => {
                modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
            });
        }
    }

    showModels() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Phone Models</h2>
                <button onclick="admin.showAddModelModal()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-plus mr-2"></i>Add Model
                </button>
            </div>
            
            <!-- Models List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${Object.entries(PHONE_MODELS).map(([brand, series]) => `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold">${brand}</h3>
                            <div class="flex space-x-2">
                                <button onclick="admin.editBrand('${brand}')" 
                                        class="text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="admin.deleteBrand('${brand}')" 
                                        class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        ${Object.entries(series).map(([seriesName, models]) => `
                            <div class="ml-4 mb-4">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-medium">${seriesName}</h4>
                                    <div class="flex space-x-2">
                                        <button onclick="admin.editSeries('${brand}', '${seriesName}')" 
                                                class="text-blue-600 hover:text-blue-800">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="admin.deleteSeries('${brand}', '${seriesName}')" 
                                                class="text-red-600 hover:text-red-800">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul class="ml-4 space-y-1">
                                    ${models.map(model => `
                                        <li class="flex justify-between items-center">
                                            <span>${model}</span>
                                            <div class="flex space-x-2">
                                                <button onclick="admin.editModel('${brand}', '${seriesName}', '${model}')" 
                                                        class="text-blue-600 hover:text-blue-800">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onclick="admin.deleteModel('${brand}', '${seriesName}', '${model}')" 
                                                        class="text-red-600 hover:text-red-800">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    showAddModelModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Add New Model</h2>
                    <button onclick="admin.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="addModelForm" onsubmit="admin.handleAddModel(event)" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Brand</label>
                        <select name="brand" onchange="admin.updateSeriesDropdown(this.value)" 
                                class="w-full px-4 py-2 rounded-lg border">
                            <option value="">Select Brand</option>
                            <option value="new">+ Add New Brand</option>
                            ${Object.keys(PHONE_MODELS).map(brand => 
                                `<option value="${brand}">${brand}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div id="newBrandInput" class="hidden">
                        <label class="block text-gray-700 mb-2">New Brand Name</label>
                        <input type="text" name="newBrand" 
                               class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Series</label>
                        <select name="series" class="w-full px-4 py-2 rounded-lg border">
                            <option value="">Select Series</option>
                            <option value="new">+ Add New Series</option>
                        </select>
                    </div>
                    <div id="newSeriesInput" class="hidden">
                        <label class="block text-gray-700 mb-2">New Series Name</label>
                        <input type="text" name="newSeries" 
                               class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Model Name</label>
                        <input type="text" name="model" required 
                               class="w-full px-4 py-2 rounded-lg border">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="admin.closeModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Add Model
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add event listeners for brand/series selection
        document.querySelector('select[name="brand"]').addEventListener('change', function() {
            document.getElementById('newBrandInput').classList.toggle('hidden', this.value !== 'new');
        });

        document.querySelector('select[name="series"]').addEventListener('change', function() {
            document.getElementById('newSeriesInput').classList.toggle('hidden', this.value !== 'new');
        });
    }

    updateSeriesDropdown(brand) {
        const seriesSelect = document.querySelector('select[name="series"]');
        seriesSelect.innerHTML = '<option value="">Select Series</option><option value="new">+ Add New Series</option>';
        
        if (brand && brand !== 'new' && PHONE_MODELS[brand]) {
            Object.keys(PHONE_MODELS[brand]).forEach(series => {
                seriesSelect.innerHTML += `<option value="${series}">${series}</option>`;
            });
        }
    }

    handleAddModel(event) {
        event.preventDefault();
        const form = event.target;
        const brandValue = form.brand.value;
        const seriesValue = form.series.value;
        const brand = brandValue === 'new' ? form.newBrand.value : brandValue;
        const series = seriesValue === 'new' ? form.newSeries.value : seriesValue;
        const model = form.model.value;

        // Validate inputs
        if (!brand || !series || !model) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Initialize brand if it doesn't exist
        if (!PHONE_MODELS[brand]) {
            PHONE_MODELS[brand] = {};
        }

        // Initialize series if it doesn't exist
        if (!PHONE_MODELS[brand][series]) {
            PHONE_MODELS[brand][series] = [];
        }

        // Check if model already exists
        if (PHONE_MODELS[brand][series].includes(model)) {
            this.showNotification('This model already exists', 'error');
            return;
        }

        // Add new model
        PHONE_MODELS[brand][series].push(model);
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Model added successfully!');
        this.closeModal();
        this.showModels();
    }

    updateBannerTitle(index, newTitle) {
        if (!SHOP_DATA.banners[index]) {
            this.showNotification('Banner not found', 'error');
            return;
        }
        
        SHOP_DATA.banners[index].title = newTitle;
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Banner title updated successfully!');
        window.opener?.location.reload();
    }

    updateBannerSubtitle(index, newSubtitle) {
        if (!SHOP_DATA.banners[index]) {
            this.showNotification('Banner not found', 'error');
            return;
        }
        
        SHOP_DATA.banners[index].subtitle = newSubtitle;
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Banner subtitle updated successfully!');
        window.opener?.location.reload();
    }

    updateBannerImage(index, newImageUrl) {
        if (!SHOP_DATA.banners[index]) {
            this.showNotification('Banner not found', 'error');
            return;
        }

        if (!newImageUrl) {
            this.showNotification('Please enter a valid image URL', 'error');
            return;
        }
        
        SHOP_DATA.banners[index].image = newImageUrl;
        saveToLocalStorage();
        this.updateDataVersion();
        this.showNotification('Banner image updated successfully!');
        window.opener?.location.reload();
    }

    addNewBanner() {
        const newBanner = {
            id: SHOP_DATA.banners.length + 1,
            image: "https://placehold.co/1920x600",
            title: "New Banner",
            subtitle: "Click to edit this banner"
        };

        SHOP_DATA.banners.push(newBanner);
        saveToLocalStorage();
        this.updateDataVersion();
        this.showCustomization(); // Refresh the customization panel
        this.showNotification('New banner added successfully!');
        window.opener?.location.reload();
    }

    deleteBanner(index) {
        if (!SHOP_DATA.banners[index]) {
            this.showNotification('Banner not found', 'error');
            return;
        }

        if (SHOP_DATA.banners.length <= 1) {
            this.showNotification('Cannot delete the last banner', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this banner?')) {
            SHOP_DATA.banners.splice(index, 1);
            saveToLocalStorage();
            this.updateDataVersion();
            this.showCustomization(); // Refresh the customization panel
            this.showNotification('Banner deleted successfully!');
            window.opener?.location.reload();
        }
    }

    updateDataVersion() {
        const currentVersion = Date.now();
        
        // Update local version
        localStorage.setItem(STORAGE_VERSION_KEY, currentVersion.toString());
        
        // Update server version
        fetch('update-version.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                version: currentVersion,
                timestamp: new Date().toISOString()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Version updated successfully');
            }
        })
        .catch(error => console.error('Error updating version:', error));
    }

    afterUpdate() {
        this.updateDataVersion();
        this.showNotification('Update successful! Changes will be visible on all devices.');
    }
}

// Initialize admin panel
console.log('Creating admin panel instance...');
const admin = new AdminPanel(); 