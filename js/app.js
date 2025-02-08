class ShopApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.selectedBrand = null;
        this.selectedSeries = null;
        
        // Check for saved user session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            // Refresh page when shop data changes
            if (e.key === 'SHOP_DATA' || e.key === 'siteLogoUrl' || e.key === 'siteTitle') {
                window.location.reload();
            }
        });
        
        this.init();
    }

    init() {
        // Add this to your existing init method
        this.updateLogo();
        
        // Check for product ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            this.showProductDetails(parseInt(productId));
        } else {
            this.renderHomePage();
        }

        this.attachEventListeners();
        this.updateLoginStatus();
    }

    attachEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('cartBtn').addEventListener('click', () => this.showCart());
        
        // Update search input handling
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Set new timeout for search (debouncing)
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300); // Wait 300ms after user stops typing
        });

        // Add search on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuBtn?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Mobile search
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        let mobileSearchTimeout;
        
        mobileSearchInput?.addEventListener('input', (e) => {
            if (mobileSearchTimeout) {
                clearTimeout(mobileSearchTimeout);
            }
            
            mobileSearchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Mobile cart and login buttons
        document.getElementById('mobileCartBtn')?.addEventListener('click', () => this.showCart());
        document.getElementById('mobileLoginBtn')?.addEventListener('click', () => this.showLoginModal());
    }

    renderHomePage() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <!-- Hero Section with Animated Banner -->
            <div class="relative h-[300px] md:h-[500px] mb-8 md:mb-16 overflow-hidden rounded-xl md:rounded-2xl">
                <div class="absolute inset-0">
                    ${SHOP_DATA.banners.map((banner, index) => `
                        <div class="absolute inset-0 transition-opacity duration-1000 ${index === 0 ? 'opacity-100' : 'opacity-0'}"
                             data-banner-index="${index}">
                            <img src="${banner.image}" 
                                 alt="${banner.title}" 
                                 class="w-full h-full object-cover object-center">
                            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                <div class="container mx-auto px-6">
                                    <div class="max-w-xl animate-fadeIn">
                                        <h1 class="text-5xl md:text-7xl text-white font-bold mb-6 leading-tight">
                                            ${banner.title}
                                        </h1>
                                        <p class="text-xl text-gray-200 mb-8">
                                            ${banner.subtitle}
                                        </p>
                                        <button class="bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-lg">
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    ${SHOP_DATA.banners.map((_, index) => `
                        <button class="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition"
                                onclick="app.changeBanner(${index})"></button>
                    `).join('')}
                </div>
            </div>

            <!-- Phone Model Selection -->
            <div class="px-4 md:px-0">
                ${this.renderModelBar()}
            </div>

            <!-- How to Order Steps -->
            <div class="container mx-auto px-4 py-12 bg-gray-50 rounded-xl my-8">
                <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        How to Order
                    </span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-300">
                            <i class="fas fa-mobile-alt text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Select Your Model</h3>
                        <p class="text-gray-600">Choose your phone model from our extensive collection</p>
                        <div class="w-12 h-1 bg-blue-600 mt-4 group-hover:w-24 transition-all duration-300"></div>
                    </div>

                    <!-- Step 2 -->
                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-all duration-300">
                            <i class="fas fa-shopping-cart text-2xl text-purple-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Add to Cart</h3>
                        <p class="text-gray-600">Select your favorite design and add it to cart</p>
                        <div class="w-12 h-1 bg-purple-600 mt-4 group-hover:w-24 transition-all duration-300"></div>
                    </div>

                    <!-- Step 3 -->
                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-all duration-300">
                            <i class="fas fa-check-circle text-2xl text-green-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Place Order</h3>
                        <p class="text-gray-600">Complete your purchase and wait for delivery</p>
                        <div class="w-12 h-1 bg-green-600 mt-4 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                </div>
            </div>

            <!-- Featured Categories -->
            <div class="container mx-auto px-4 mb-8 md:mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Shop by Category
                    </span>
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    ${SHOP_DATA.categories.map(category => `
                        <div class="group relative overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-300"
                             onclick="app.showCategory(${category.id})">
                            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                            <img src="${category.image}" 
                                 alt="${category.name}" 
                                 class="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700">
                            <div class="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                <h3 class="text-2xl font-bold text-white mb-2">${category.name}</h3>
                                <p class="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    ${category.description}
                                </p>
                                <button class="mt-4 bg-white/90 text-gray-900 px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white">
                                    View Collection
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Featured Products -->
            <div class="bg-gradient-to-b from-gray-50 to-white py-8 md:py-16 px-4">
                <div class="container mx-auto">
                    <h2 class="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
                        <span class="relative">Featured Products</span>
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        ${this.renderFeaturedProducts()}
                    </div>
                </div>
            </div>

            <!-- About Section -->
            <div class="container mx-auto px-4 py-12">
                <div class="bg-white rounded-2xl shadow-md p-8">
                    <h2 class="text-3xl font-bold mb-6 text-center">Buy Mobile Covers Online India at CoSlim.in</h2>
                    
                    <div class="prose max-w-none text-gray-600 space-y-4">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 class="text-xl font-semibold mb-3 text-gray-800">Premium Mobile Protection</h3>
                                <p>Shop Stylish Mobile covers online (200+ Types in Rs 99) at CoSlim online store. 
                                Browse through our extensive collection of Branded Mobile Tempered Glasses and funky 
                                phone back covers for over 350 Smartphone models.</p>
                            </div>
                            
                            <div>
                                <h3 class="text-xl font-semibold mb-3 text-gray-800">Designer Collection</h3>
                                <p>CoSlim is one of the best websites for mobile covers online with distinctive 
                                Phone cover designs and designer mobile phone cases. Make a smart choice and shop 
                                amazing mobile covers at reasonable prices.</p>
                            </div>
                        </div>

                        <div class="mt-8">
                            <h3 class="text-xl font-semibold mb-3 text-gray-800">Quality & Protection</h3>
                            <ul class="list-disc pl-5 space-y-2">
                                <li>Premium polycarbonate material for durability</li>
                                <li>Complete device protection from everyday casualties</li>
                                <li>Essential smartphone accessories at best prices</li>
                                <li>Huge diversity in mobile cover categories</li>
                                <li>Protective cases that keep your device safe and sound</li>
                            </ul>
                        </div>

                        <div class="bg-blue-50 p-6 rounded-xl mt-8">
                            <h3 class="text-xl font-semibold mb-3 text-blue-800">Why Choose CoSlim?</h3>
                            <div class="grid md:grid-cols-3 gap-4">
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-check-circle text-blue-600"></i>
                                    <span>200+ Design Types</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-check-circle text-blue-600"></i>
                                    <span>Starting at ₹99</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-check-circle text-blue-600"></i>
                                    <span>350+ Phone Models</span>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-8">
                            <p class="text-lg">Proceed to your funky mobile covers online shopping at CoSlim - 
                            Your one-stop destination for all smartphone protection needs!</p>
                            <button onclick="app.showAllProducts()" 
                                    class="mt-4 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Trust Builders Section -->
            <div class="container mx-auto px-4 py-12">
                <!-- Customer Reviews & Ratings -->
                <div class="bg-white rounded-2xl shadow-md p-8 mb-8">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold mb-2">Trusted by 8,000+ Happy Customers</h2>
                        <div class="flex justify-center items-center space-x-2">
                            <div class="text-yellow-400 text-2xl">★★★★★</div>
                            <span class="text-xl font-semibold">4.8/5</span>
                            <span class="text-gray-500">(2,500+ Reviews)</span>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-6">
                        <!-- Featured Customer Reviews -->
                        <div class="bg-gray-50 p-6 rounded-xl">
                            <div class="text-yellow-400 mb-2">★★★★★</div>
                            <p class="text-gray-700 mb-4">"Perfect fit for my phone! The quality is excellent and the delivery was super fast. Will definitely buy again!"</p>
                            <div class="flex items-center">
                                <img src="https://i.pravatar.cc/40?img=1" alt="Customer" class="rounded-full mr-3">
                                <div>
                                    <p class="font-semibold">Rahul Sharma</p>
                                    <p class="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <!-- Add more reviews similarly -->
                    </div>
                </div>

                <!-- Trust Features -->
                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl shadow-md text-center">
                        <i class="fas fa-truck text-4xl text-blue-600 mb-4"></i>
                        <h3 class="font-semibold mb-2">Free Shipping</h3>
                        <p class="text-gray-600">On orders above ₹499</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center">
                        <i class="fas fa-shield-alt text-4xl text-blue-600 mb-4"></i>
                        <h3 class="font-semibold mb-2">Secure Payments</h3>
                        <p class="text-gray-600">100% secure transactions</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center">
                        <i class="fas fa-undo text-4xl text-blue-600 mb-4"></i>
                        <h3 class="font-semibold mb-2">Easy Returns</h3>
                        <p class="text-gray-600">7-day return policy</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center">
                        <i class="fas fa-headset text-4xl text-blue-600 mb-4"></i>
                        <h3 class="font-semibold mb-2">24/7 Support</h3>
                        <p class="text-gray-600">Always here to help</p>
                    </div>
                </div>

                <!-- Customer Support Info -->
                <div class="bg-blue-50 rounded-2xl p-8 mt-8">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold mb-2">We're Here to Help</h2>
                        <p class="text-gray-600">Our dedicated support team is available 24/7</p>
                    </div>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="flex items-center justify-center space-x-3">
                            <i class="fas fa-phone text-2xl text-blue-600"></i>
                            <div>
                                <p class="font-semibold">Call Us</p>
                                <p class="text-gray-600">1800-123-4567</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-center space-x-3">
                            <i class="fas fa-envelope text-2xl text-blue-600"></i>
                            <div>
                                <p class="font-semibold">Email Us</p>
                                <p class="text-gray-600">support@coslim.in</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-center space-x-3">
                            <i class="fas fa-comments text-2xl text-blue-600"></i>
                            <div>
                                <p class="font-semibold">Live Chat</p>
                                <p class="text-gray-600">Available 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize banner rotation
        this.startBannerRotation();
    }

    renderFeaturedProducts() {
        return SHOP_DATA.products.slice(0, 4).map(product => `
            <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 overflow-hidden">
                <div class="relative overflow-hidden rounded-xl aspect-square">
                    <img src="${product.images[0]}" 
                         alt="${product.name}" 
                         class="w-full h-full object-contain hover:object-cover transition-all duration-500">
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button onclick="app.showProductDetails(${product.id})" 
                                class="bg-white text-gray-900 px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all">
                            View Details
                        </button>
                    </div>
                </div>
                <div class="pt-4">
                    <h3 class="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">${product.name}</h3>
                    <div class="flex justify-between items-center mb-4">
                        <p class="text-2xl font-bold text-blue-600">${this.formatPrice(product.price)}</p>
                        <div class="text-yellow-400">
                            ${'★'.repeat(5)}
                        </div>
                    </div>
                    <button onclick="app.addToCart(${product.id})" 
                            class="w-full bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-blue-600 transform hover:scale-105 transition-all">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    showLoginModal() {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Login</h2>
                    <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="loginForm" onsubmit="app.handleLogin(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" required
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Password</label>
                            <input type="password" name="password" required
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" 
                                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                </form>

                <!-- Forgot Password Link -->
                <div class="mt-4 text-center">
                    <button onclick="app.showForgotPassword()" class="text-blue-600 hover:text-blue-800">
                        Forgot Password?
                    </button>
                </div>

                <!-- Sign Up Option -->
                <div class="mt-6 pt-6 border-t text-center">
                    <p class="text-gray-600 mb-2">Don't have an account?</p>
                    <button onclick="app.showSignupForm()" 
                            class="text-blue-600 hover:text-blue-800 font-semibold">
                        Create Account
                    </button>
                </div>
            </div>
        `;
    }

    handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const user = USERS.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            // Save user session to localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateLoginStatus();
            this.closeModal();
            this.showNotification('Login successful!');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    showSignupForm() {
        const modal = document.getElementById('modalContainer');
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Create Account</h2>
                    <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="signupForm" onsubmit="app.handleSignup(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Full Name</label>
                            <input type="text" name="name" required 
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" required 
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Password</label>
                            <input type="password" name="password" required 
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Confirm Password</label>
                            <input type="password" name="confirmPassword" required 
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Sign Up
                        </button>
                    </div>
                </form>
                <div class="mt-6 pt-6 border-t text-center">
                    <p class="text-gray-600 mb-2">Already have an account?</p>
                    <button onclick="app.showLoginModal()" 
                            class="text-blue-600 hover:text-blue-800 font-semibold">
                        Login
                    </button>
                </div>
            </div>
        `;
    }

    handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords match
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Check if email already exists
        if (USERS.some(user => user.email === email)) {
            this.showNotification('Email already registered', 'error');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            addresses: []
        };

        // Add new user
        USERS.push(newUser);
        saveToLocalStorage();

        // Auto login after signup
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.updateLoginStatus();

        this.closeModal();
        this.showNotification('Account created successfully!');
    }

    showForgotPassword() {
        const modal = document.getElementById('modalContainer');
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Reset Password</h2>
                    <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="forgotPasswordForm" onsubmit="app.handleForgotPassword(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" required
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Reset Password
                        </button>
                    </div>
                </form>
                <div class="mt-6 pt-6 border-t text-center">
                    <button onclick="app.showLoginModal()" 
                            class="text-blue-600 hover:text-blue-800 font-semibold">
                        Back to Login
                    </button>
                </div>
            </div>
        `;
    }

    handleForgotPassword(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        
        // Check if email exists
        const userIndex = USERS.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            // Generate a temporary password
            const tempPassword = Math.random().toString(36).slice(-8);
            
            // Update user's password
            USERS[userIndex].password = tempPassword;
            saveToLocalStorage();

            // Show temporary password to user (in real app, this would be sent via email)
            this.closeModal();
            const modalContainer = document.getElementById('modalContainer');
            modalContainer.classList.remove('hidden');
            modalContainer.innerHTML = `
                <div class="bg-white p-8 rounded-lg max-w-md w-full">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Password Reset</h2>
                        <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <p class="text-gray-600">Your temporary password has been generated:</p>
                        <div class="bg-gray-100 p-4 rounded-lg text-center">
                            <code class="text-lg font-mono">${tempPassword}</code>
                        </div>
                        <p class="text-sm text-gray-500">Please use this password to login and change it immediately.</p>
                        <button onclick="app.showLoginModal()" 
                                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Go to Login
                        </button>
                    </div>
                </div>
            `;
        } else {
            this.showNotification('Email not found', 'error');
        }
    }

    closeModal() {
        document.getElementById('modalContainer').classList.add('hidden');
    }

    showCategory(categoryId) {
        const products = SHOP_DATA.products.filter(p => p.categoryId === categoryId);
        const category = SHOP_DATA.categories.find(c => c.id === categoryId);
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="mb-8">
                <button onclick="app.renderHomePage()" class="text-blue-600 mb-4">
                    <i class="fas fa-arrow-left"></i> Back to Home
                </button>
                <h1 class="text-3xl font-bold">${category.name}</h1>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                ${products.map(product => `
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <img src="${product.images[0]}" 
                             alt="${product.name}" 
                             class="w-full h-48 object-cover rounded cursor-pointer"
                             onclick="app.showProductDetails(${product.id})">
                        <h3 class="text-lg font-semibold mt-2">${product.name}</h3>
                        <p class="text-gray-600">${this.formatPrice(product.price)}</p>
                        <button onclick="app.addToCart(${product.id})" 
                                class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                            Add to Cart
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showProductDetails(productId) {
        // Update URL with product ID
        window.history.pushState({ productId }, '', `?product=${productId}`);
        
        const product = SHOP_DATA.products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            this.renderHomePage();
            return;
        }
        
        const productReviews = REVIEWS[productId] || [];
        const averageRating = productReviews.length > 0 
            ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
            : 'No ratings yet';
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Product Images -->
                        <div class="space-y-4">
                            <div class="aspect-square rounded-lg overflow-hidden">
                                <img src="${product.images[0]}" 
                                     alt="${product.name}" 
                                     class="w-full h-full object-contain hover:object-cover transition-all duration-500">
                            </div>
                            <div class="grid grid-cols-4 gap-4">
                                ${product.images.map(image => `
                                    <div class="aspect-square rounded-lg overflow-hidden cursor-pointer">
                                        <img src="${image}" 
                                             alt="${product.name}" 
                                             class="w-full h-full object-contain hover:object-cover transition-all duration-500">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="product-info">
                            <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
                            <p class="text-2xl text-blue-600 mb-4">${this.formatPrice(product.price)}</p>
                            <p class="text-gray-600 mb-4">${product.description}</p>
                            <div class="mb-4">
                                <span class="font-bold">Availability:</span>
                                <span class="${product.stock > 0 ? 'text-green-600' : 'text-red-600'}">
                                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div class="specifications mb-6">
                                <h3 class="font-bold mb-2">Specifications:</h3>
                                <ul class="list-disc pl-5">
                                    ${Object.entries(product.specifications).map(([key, value]) => `
                                        <li>${key}: ${value}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <button onclick="app.addToCart(${product.id})" 
                                        class="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                                    <i class="fas fa-shopping-cart mr-2"></i>
                                    Add to Cart
                                </button>
                                <button onclick="app.buyNow(${product.id})" 
                                        class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-bolt mr-2"></i>
                                    Buy Now
                                </button>
                            </div>

                            <!-- Reviews Section -->
                            <div class="mt-12 border-t pt-8">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-2xl font-bold">Customer Reviews</h2>
                                    <div class="flex items-center space-x-2">
                                        <div class="text-yellow-400 text-xl">${typeof averageRating === 'string' ? '' : '★'}</div>
                                        <span class="text-xl font-semibold">${averageRating}</span>
                                        <span class="text-gray-500">(${productReviews.length} reviews)</span>
                                    </div>
                                </div>

                                <!-- Write Review Button -->
                                ${this.currentUser ? `
                                    <button onclick="app.showReviewForm(${productId})"
                                            class="mb-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                        Write a Review
                                    </button>
                                ` : `
                                    <p class="mb-8 text-gray-600">
                                        Please <button onclick="app.showLoginModal()" class="text-blue-600 hover:underline">login</button> 
                                        to write a review
                                    </p>
                                `}

                                <!-- Reviews List -->
                                <div class="space-y-6">
                                    ${productReviews.length > 0 ? productReviews.map(review => `
                                        <div class="border-b pb-6">
                                            <div class="flex items-center justify-between mb-2">
                                                <div class="flex items-center space-x-2">
                                                    <div class="font-semibold">${review.userName}</div>
                                                    ${review.verified ? `
                                                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                            Verified Purchase
                                                        </span>
                                                    ` : ''}
                                                </div>
                                                <div class="text-gray-500 text-sm">${review.date}</div>
                                            </div>
                                            <div class="flex items-center mb-2">
                                                <div class="text-yellow-400">
                                                    ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                                                </div>
                                            </div>
                                            <p class="text-gray-700">${review.comment}</p>
                                        </div>
                                    `).join('') : `
                                        <p class="text-gray-600">No reviews yet. Be the first to review this product!</p>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showReviewForm(productId) {
        const modal = document.getElementById('modalContainer');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 class="text-2xl font-bold mb-4">Write a Review</h2>
                <form id="reviewForm" onsubmit="app.submitReview(event, ${productId})" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Rating</label>
                        <div class="flex space-x-2">
                            ${[1,2,3,4,5].map(num => `
                                <label class="cursor-pointer">
                                    <input type="radio" name="rating" value="${num}" class="hidden" required>
                                    <span class="text-2xl rating-star" data-rating="${num}">☆</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Your Review</label>
                        <textarea name="comment" required
                                  class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                  rows="4"
                                  placeholder="Share your experience with this product..."></textarea>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="app.closeModal()"
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button type="submit"
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add rating star interaction
        const stars = modal.querySelectorAll('.rating-star');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.textContent = '★';
                    } else {
                        s.textContent = '☆';
                    }
                });
            });
        });
    }

    submitReview(event, productId) {
        event.preventDefault();
        const form = event.target;
        const rating = parseInt(form.rating.value);
        const comment = form.comment.value;

        // Initialize reviews array for product if it doesn't exist
        if (!REVIEWS[productId]) {
            REVIEWS[productId] = [];
        }

        // Add new review
        const newReview = {
            id: Date.now(),
            userId: this.currentUser?.id || 1,
            userName: this.currentUser?.name || 'Anonymous',
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            verified: this.hasUserPurchased(productId)
        };

        REVIEWS[productId].unshift(newReview);
        saveToLocalStorage();
        this.closeModal();
        this.showNotification('Review submitted successfully!');
        this.showProductDetails(productId);
    }

    hasUserPurchased(productId) {
        // Check if user has purchased this product
        return ORDERS.some(order => 
            order.userId === this.currentUser?.id &&
            order.products.some(p => p.productId === productId)
        );
    }

    addToCart(productId) {
        const product = SHOP_DATA.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                productId,
                quantity: 1,
                price: product.price
            });
        }
        
        this.updateCartCount();
        this.showNotification('Product added to cart!');
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const mobileCartCount = document.getElementById('mobileCartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        if (mobileCartCount) mobileCartCount.textContent = totalItems;
    }

    showCart() {
        const mainContent = document.getElementById('mainContent');
        const total = this.cart.reduce((sum, item) => {
            const product = SHOP_DATA.products.find(p => p.id === item.productId);
            return sum + (product.price * item.quantity);
        }, 0);

        mainContent.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8">
                <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
                ${this.cart.length === 0 ? `
                    <p class="text-gray-600">Your cart is empty</p>
                ` : `
                    <div class="space-y-4">
                        ${this.cart.map(item => {
                            const product = SHOP_DATA.products.find(p => p.id === item.productId);
                            return `
                                <div class="flex items-center justify-between border-b pb-4">
                                    <div class="flex items-center">
                                        <img src="${product.images[0]}" 
                                             alt="${product.name}" 
                                             class="w-24 h-24 object-cover rounded">
                                        <div class="ml-4">
                                            <h3 class="font-semibold">${product.name}</h3>
                                            <p class="text-gray-600">${this.formatPrice(product.price)}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <button onclick="app.updateQuantity(${product.id}, ${item.quantity - 1})"
                                                class="px-2 py-1 border rounded">-</button>
                                        <span class="mx-4">${item.quantity}</span>
                                        <button onclick="app.updateQuantity(${product.id}, ${item.quantity + 1})"
                                                class="px-2 py-1 border rounded">+</button>
                                        <button onclick="app.removeFromCart(${product.id})"
                                                class="ml-4 text-red-600">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        <div class="flex justify-between items-center mt-8">
                            <div class="text-xl font-bold">Total: ${this.formatPrice(total)}</div>
                            <button onclick="app.showCheckout()"
                                    class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showCheckout() {
        const mainContent = document.getElementById('mainContent');
        const total = this.cart.reduce((sum, item) => {
            const product = SHOP_DATA.products.find(p => p.id === item.productId);
            return sum + (product.price * item.quantity);
        }, 0);

        mainContent.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold mb-8">Checkout</h1>
                
                <!-- Order Summary -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        ${this.cart.map(item => {
                            const product = SHOP_DATA.products.find(p => p.id === item.productId);
                            return `
                                <div class="flex justify-between items-center mb-2">
                                    <div>
                                        <span class="font-semibold">${product.name}</span>
                                        <span class="text-gray-600"> × ${item.quantity}</span>
                                    </div>
                                    <span>${this.formatPrice(product.price * item.quantity)}</span>
                                </div>
                            `;
                        }).join('')}
                        <div class="border-t mt-4 pt-4">
                            <div class="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${this.formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shipping Address Form -->
                <form id="checkoutForm" onsubmit="app.handlePlaceOrder(event)" class="space-y-6">
                    <div>
                        <h2 class="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 mb-2">Full Name</label>
                                <input type="text" name="fullName" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                            <div>
                                <label class="block text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" name="phone" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-gray-700 mb-2">Email</label>
                                <input type="email" name="email" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-gray-700 mb-2">Street Address</label>
                                <input type="text" name="address" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                            <div>
                                <label class="block text-gray-700 mb-2">City</label>
                                <input type="text" name="city" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                            <div>
                                <label class="block text-gray-700 mb-2">Postal Code</label>
                                <input type="text" name="postalCode" required
                                       class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600">
                            </div>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div>
                        <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <label class="flex items-center space-x-3">
                                <input type="radio" name="paymentMethod" value="cod" checked
                                       class="form-radio text-blue-600">
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>

                    <!-- Place Order Button -->
                    <div class="flex justify-end mt-8">
                        <button type="button" onclick="app.showCart()" 
                                class="mr-4 px-6 py-3 text-gray-600 hover:text-gray-800">
                            Back to Cart
                        </button>
                        <button type="submit" 
                                class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    handlePlaceOrder(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Generate a unique order ID
        const orderId = Date.now() + Math.floor(Math.random() * 1000);
        
        // Create products array with necessary details
        const orderProducts = this.cart.map(item => {
            const product = SHOP_DATA.products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            };
        });
        
        const orderDetails = {
            id: orderId,
            userEmail: formData.get('email'),
            shippingAddress: {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode')
            },
            paymentMethod: formData.get('paymentMethod'),
            products: orderProducts,
            total: this.cart.reduce((sum, item) => {
                const product = SHOP_DATA.products.find(p => p.id === item.productId);
                return sum + (product.price * item.quantity);
            }, 0),
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };

        // Add order to ORDERS array
        if (!window.ORDERS) {
            window.ORDERS = [];
        }
        window.ORDERS.push(orderDetails);
        saveToLocalStorage();

        // Clear cart and show success message
        this.cart = [];
        this.updateCartCount();
        
        // Show order confirmation with order ID
        this.showOrderConfirmation(orderDetails);
    }

    showOrderConfirmation(orderDetails) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
                <div class="mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-green-600 text-2xl"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
                    <p class="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
                </div>

                <div class="text-left bg-gray-50 p-6 rounded-lg mb-6">
                    <h2 class="font-semibold mb-4">Order Details</h2>
                    <p><strong>Order Total:</strong> ${this.formatPrice(orderDetails.total)}</p>
                    <p><strong>Shipping Address:</strong></p>
                    <p class="ml-4">
                        ${orderDetails.shippingAddress.fullName}<br>
                        ${orderDetails.shippingAddress.address}<br>
                        ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}
                    </p>
                </div>

                <button onclick="app.renderHomePage()" 
                        class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    Continue Shopping
                </button>
            </div>
        `;
    }

    // Add more methods for other functionality

    // Add these new methods for banner functionality
    startBannerRotation() {
        if (this.bannerInterval) {
            clearInterval(this.bannerInterval);
        }
        
        this.currentBanner = 0;
        this.bannerInterval = setInterval(() => {
            this.currentBanner = (this.currentBanner + 1) % SHOP_DATA.banners.length;
            this.changeBanner(this.currentBanner);
        }, 5000);
    }

    changeBanner(index) {
        const banners = document.querySelectorAll('[data-banner-index]');
        banners.forEach((banner, i) => {
            banner.classList.toggle('opacity-0', i !== index);
        });
    }

    formatPrice(price) {
        return `₹${price.toLocaleString('en-IN')}`;
    }

    renderModelBar() {
        return `
            <div class="bg-white shadow-md mb-8 rounded-lg overflow-visible max-w-2xl mx-auto">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-6 text-center">Find Accessories for Your Phone</h3>
                    <div class="flex flex-col space-y-4">
                        <!-- Brand Dropdown -->
                        <div class="relative">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Select Brand</label>
                            <button type="button" onclick="app.toggleDropdown('brandDropdown')" 
                                    class="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex justify-between items-center border">
                                <span class="${this.selectedBrand ? 'text-gray-900' : 'text-gray-500'}">
                                    ${this.selectedBrand || 'Choose a brand'}
                                </span>
                                <i class="fas fa-chevron-down text-gray-400"></i>
                            </button>
                            <div id="brandDropdown" class="hidden absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                ${Object.keys(PHONE_MODELS).map(brand => `
                                    <button type="button" onclick="app.selectBrand('${brand}')"
                                            class="block w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors">
                                        ${brand}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Series Dropdown (only shown after brand selection) -->
                        ${this.selectedBrand ? `
                            <div class="relative">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Select Series</label>
                                <button type="button" onclick="app.toggleDropdown('seriesDropdown')"
                                        class="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex justify-between items-center border">
                                    <span class="${this.selectedSeries ? 'text-gray-900' : 'text-gray-500'}">
                                        ${this.selectedSeries || 'Choose a series'}
                                    </span>
                                    <i class="fas fa-chevron-down text-gray-400"></i>
                                </button>
                                <div id="seriesDropdown" class="hidden absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    ${Object.keys(PHONE_MODELS[this.selectedBrand]).map(series => `
                                        <button type="button" onclick="app.selectSeries('${series}')"
                                                class="block w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors">
                                            ${series}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Model Dropdown (only shown after series selection) -->
                        ${this.selectedBrand && this.selectedSeries ? `
                            <div class="relative">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
                                <button type="button" onclick="app.toggleDropdown('modelDropdown')"
                                        class="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex justify-between items-center border">
                                    <span class="text-gray-500">Choose a model</span>
                                    <i class="fas fa-chevron-down text-gray-400"></i>
                                </button>
                                <div id="modelDropdown" class="hidden absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    ${PHONE_MODELS[this.selectedBrand][this.selectedSeries].map(model => `
                                        <button type="button" onclick="app.filterByModel('${this.selectedBrand}', '${model}')"
                                                class="block w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors">
                                            ${model}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    toggleDropdown(dropdownId) {
        // First, close any open dropdowns except the one being toggled
        const allDropdowns = ['brandDropdown', 'seriesDropdown', 'modelDropdown'];
        allDropdowns.forEach(id => {
            if (id !== dropdownId) {
                const dropdown = document.getElementById(id);
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            }
        });

        // Toggle the clicked dropdown
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.classList.toggle('hidden');

            // Add a global click listener to close the dropdown when clicking outside
            const handleClickOutside = (e) => {
                const isClickedInsideDropdown = dropdown.contains(e.target);
                const isClickedOnButton = e.target.closest(`[onclick*="${dropdownId}"]`);
                
                if (!isClickedInsideDropdown && !isClickedOnButton) {
                    dropdown.classList.add('hidden');
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            };

            // Use mousedown instead of click for better UX
            document.addEventListener('mousedown', handleClickOutside);
        }
    }

    selectBrand(brand) {
        this.selectedBrand = brand;
        this.selectedSeries = null; // Reset series when brand changes
        const mainContent = document.getElementById('mainContent');
        const modelBarContainer = mainContent.querySelector('.bg-white.shadow-md');
        modelBarContainer.outerHTML = this.renderModelBar();
    }

    selectSeries(series) {
        this.selectedSeries = series;
        const mainContent = document.getElementById('mainContent');
        const modelBarContainer = mainContent.querySelector('.bg-white.shadow-md');
        modelBarContainer.outerHTML = this.renderModelBar();
    }

    filterByModel(brand, model) {
        try {
            const compatibleProducts = SHOP_DATA.products.filter(product => 
                product.brand === brand && product.model === model
            );

            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="mb-8">
                    <button onclick="app.renderHomePage()" class="text-blue-600 mb-4">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </button>
                    <h1 class="text-3xl font-bold mb-4">${model} Accessories</h1>
                    ${this.renderModelBar()}
                </div>
                ${compatibleProducts.length > 0 ? `
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        ${compatibleProducts.map(product => `
                            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                <img src="${product.images[0]}" 
                                     alt="${product.name}" 
                                     class="w-full h-48 object-cover rounded cursor-pointer"
                                     onclick="app.showProductDetails(${product.id})">
                                <h3 class="text-lg font-semibold mt-2">${product.name}</h3>
                                <p class="text-gray-600">${this.formatPrice(product.price)}</p>
                                <button onclick="app.addToCart(${product.id})" 
                                        class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                                    Add to Cart
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <div class="mb-4">
                            <i class="fas fa-search text-gray-400 text-5xl"></i>
                        </div>
                        <p class="text-gray-600">No accessories found for ${model}</p>
                        <p class="text-gray-500 mt-2">Try searching for a different model</p>
                    </div>
                `}
            `;
        } catch (error) {
            console.error('Error filtering products:', error);
            this.showNotification('An error occurred while filtering products', 'error');
        }
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        const product = SHOP_DATA.products.find(p => p.id === productId);
        if (newQuantity > product.stock) {
            this.showNotification(`Only ${product.stock} items available`, 'error');
            return;
        }

        const cartItem = this.cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            this.updateCartCount();
            this.showCart(); // Refresh cart display
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.updateCartCount();
        this.showCart(); // Refresh cart display
    }

    // Clean up when leaving home page
    cleanupHomePage() {
        if (this.bannerInterval) {
            clearInterval(this.bannerInterval);
            this.bannerInterval = null;
        }
    }

    // Add this new method for Buy Now functionality
    buyNow(productId) {
        // Clear existing cart
        this.cart = [];
        
        // Add this product to cart
        const product = SHOP_DATA.products.find(p => p.id === productId);
        this.cart.push({
            productId,
            quantity: 1,
            price: product.price
        });
        
        // Update cart count
        this.updateCartCount();
        
        // Go directly to checkout
        this.showCheckout();
    }

    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.renderHomePage();
            return;
        }

        const searchResults = this.searchProducts(searchTerm.toLowerCase());
        this.renderSearchResults(searchResults, searchTerm);
    }

    searchProducts(searchTerm) {
        let results = [];
        
        // Search through all brands and models
        Object.entries(PHONE_MODELS).forEach(([brand, series]) => {
            Object.entries(series).forEach(([seriesName, models]) => {
                models.forEach(model => {
                    if (model.toLowerCase().includes(searchTerm) ||
                        brand.toLowerCase().includes(searchTerm) ||
                        seriesName.toLowerCase().includes(searchTerm)) {
                        results.push({
                            brand,
                            series: seriesName,
                            model
                        });
                    }
                });
            });
        });

        return results;
    }

    renderSearchResults(results, searchTerm) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="mb-8">
                <button onclick="app.renderHomePage()" class="text-blue-600 mb-4">
                    <i class="fas fa-arrow-left"></i> Back to Home
                </button>
                <h1 class="text-3xl font-bold mb-4">Search Results for "${searchTerm}"</h1>
            </div>
            ${results.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    ${results.map(result => `
                        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div class="mb-2">
                                <span class="text-sm text-gray-500">${result.brand}</span>
                                <h3 class="text-lg font-semibold">${result.model}</h3>
                                <p class="text-sm text-gray-600">${result.series}</p>
                            </div>
                            <div class="flex justify-between items-center mt-4">
                                <button onclick="app.filterByModel('${result.brand}', '${result.model}')"
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                    View Accessories
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="text-center py-12">
                    <div class="mb-4">
                        <i class="fas fa-search text-gray-400 text-5xl"></i>
                    </div>
                    <p class="text-xl text-gray-600 mb-2">No results found for "${searchTerm}"</p>
                    <p class="text-gray-500">Try searching with different keywords</p>
                </div>
            `}
        `;
    }

    showOrderTracking() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 class="text-3xl font-bold mb-8">Track Your Order</h1>
                
                <!-- Order Search Form -->
                <form id="trackOrderForm" onsubmit="app.handleTrackOrder(event)" class="mb-8">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Order ID</label>
                            <input type="text" name="orderId" required
                                   placeholder="Enter your order ID"
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" required
                                   placeholder="Enter your email"
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button type="submit" 
                                class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                            Track Order
                        </button>
                    </div>
                </form>

                <!-- Order Details will be displayed here -->
                <div id="orderDetails"></div>
            </div>
        `;
    }

    handleTrackOrder(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const orderId = parseInt(formData.get('orderId'));
        const email = formData.get('email');

        // Find the order
        const order = ORDERS.find(o => o.id === orderId && o.userEmail === email);

        const orderDetails = document.getElementById('orderDetails');
        
        if (!order) {
            orderDetails.innerHTML = `
                <div class="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                    No order found with the provided details. Please check and try again.
                </div>
            `;
            return;
        }

        // Get order status steps
        const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentStep = statusSteps.indexOf(order.status.toLowerCase());

        orderDetails.innerHTML = `
            <div class="border-t pt-8">
                <h2 class="text-2xl font-bold mb-6">Order #${order.id}</h2>
                
                <!-- Order Status Timeline -->
                <div class="mb-8">
                    <div class="flex justify-between mb-4">
                        ${statusSteps.map((step, index) => `
                            <div class="flex flex-col items-center flex-1">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center 
                                    ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}">
                                    <i class="fas ${
                                        step === 'pending' ? 'fa-clock' :
                                        step === 'processing' ? 'fa-cog' :
                                        step === 'shipped' ? 'fa-truck' :
                                        'fa-check'
                                    }"></i>
                                </div>
                                <div class="text-sm mt-2 capitalize">${step}</div>
                            </div>
                            ${index < statusSteps.length - 1 ? `
                                <div class="flex-1 flex items-center">
                                    <div class="h-1 w-full ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}"></div>
                                </div>
                            ` : ''}
                        `).join('')}
                    </div>
                </div>

                <!-- Order Details -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="font-semibold mb-4">Order Details</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-gray-600">Order Date</p>
                                <p class="font-semibold">${order.date}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Status</p>
                                <p class="font-semibold capitalize">${order.status}</p>
                            </div>
                        </div>
                        
                        <!-- Order Items -->
                        <div class="border-t pt-4">
                            <p class="font-semibold mb-2">Items</p>
                            ${order.products.map(item => {
                                const product = SHOP_DATA.products.find(p => p.id === item.productId);
                                return `
                                    <div class="flex justify-between items-center py-2">
                                        <span>${product?.name} × ${item.quantity}</span>
                                        <span>₹${item.price * item.quantity}</span>
                                    </div>
                                `;
                            }).join('')}
                            <div class="border-t mt-4 pt-4 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹${order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLoginStatus() {
        const loginBtn = document.getElementById('loginBtn');
        const cartCount = document.getElementById('cartCount');
        const mobileCartCount = document.getElementById('mobileCartCount');
        
        if (this.currentUser) {
            // Update to show user name as a button
            loginBtn.innerHTML = `
                <div class="relative group">
                    <button onclick="app.showUserProfile()" class="flex items-center space-x-2 text-white">
                        <i class="fas fa-user"></i>
                        <span>${this.currentUser.name}</span>
                    </button>
                </div>
            `;
        } else {
            loginBtn.textContent = 'Login';
        }
        
        // Update cart count
        cartCount.textContent = this.cart.length;
        if (mobileCartCount) {
            mobileCartCount.textContent = this.cart.length;
        }
    }

    // Add this new method
    showUserProfile() {
        const mainContent = document.getElementById('mainContent');
        const user = this.currentUser;
        
        if (!user) {
            this.showNotification('Please login to view profile', 'error');
            return;
        }

        mainContent.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="max-w-4xl mx-auto">
                    <!-- Profile Header -->
                    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div class="flex items-center space-x-4">
                            <div class="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl">
                                ${user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold">${user.name}</h1>
                                <p class="text-gray-600">${user.email}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Profile Sections -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Personal Information -->
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-xl font-bold mb-4">Personal Information</h2>
                            <form onsubmit="app.updateProfile(event)" class="space-y-4">
                                <div>
                                    <label class="block text-gray-700 mb-2">Full Name</label>
                                    <input type="text" name="name" value="${user.name}"
                                           class="w-full px-4 py-2 rounded-lg border">
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" name="phone" value="${user.phone || ''}"
                                           class="w-full px-4 py-2 rounded-lg border">
                                </div>
                                <button type="submit" 
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Update Profile
                                </button>
                            </form>
                        </div>

                        <!-- Account Security -->
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-xl font-bold mb-4">Account Security</h2>
                            <button onclick="app.showChangePassword()"
                                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                                Change Password
                            </button>
                        </div>

                        <!-- Addresses -->
                        <div class="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold">Saved Addresses</h2>
                                <button onclick="app.showAddAddressModal()"
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Add New Address
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${user.addresses ? user.addresses.map((address, index) => `
                                    <div class="border rounded-lg p-4">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <p class="font-semibold">${address.fullName}</p>
                                                <p class="text-gray-600">${address.phone}</p>
                                                <p class="text-gray-600">${address.address}</p>
                                                <p class="text-gray-600">${address.city} - ${address.postalCode}</p>
                                            </div>
                                            <button onclick="app.deleteAddress(${index})"
                                                    class="text-red-600 hover:text-red-800">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : '<p class="text-gray-600">No addresses saved yet</p>'}
                            </div>
                        </div>

                        <!-- Orders Section -->
                        <div class="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold">Recent Orders</h2>
                                <button onclick="app.showOrders()"
                                        class="text-blue-600 hover:text-blue-800">
                                    View All Orders
                                </button>
                            </div>
                            ${this.renderRecentOrders()}
                        </div>
                    </div>

                    <!-- Logout Button -->
                    <div class="mt-6 text-center">
                        <button onclick="app.logout()" 
                                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Add this helper method for rendering recent orders
    renderRecentOrders() {
        const userOrders = window.ORDERS.filter(order => order.userEmail === this.currentUser.email)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (userOrders.length === 0) {
            return '<p class="text-gray-600">No orders yet</p>';
        }

        return `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left">Order ID</th>
                            <th class="px-4 py-2 text-left">Date</th>
                            <th class="px-4 py-2 text-left">Total</th>
                            <th class="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userOrders.map(order => `
                            <tr class="border-t">
                                <td class="px-4 py-2">#${order.id}</td>
                                <td class="px-4 py-2">${new Date(order.date).toLocaleDateString()}</td>
                                <td class="px-4 py-2">₹${order.total}</td>
                                <td class="px-4 py-2">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                          'bg-yellow-100 text-yellow-800'}">
                                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    updateProfile(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Update user data
        const userIndex = USERS.findIndex(u => u.email === this.currentUser.email);
        if (userIndex !== -1) {
            USERS[userIndex] = {
                ...USERS[userIndex],
                name: formData.get('name'),
                phone: formData.get('phone')
            };
            this.currentUser = USERS[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            saveToLocalStorage();
            this.updateLoginStatus();
            this.showNotification('Profile updated successfully!');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateLoginStatus();
        this.renderHomePage();
        this.showNotification('Logged out successfully!');
    }

    showAddAddressModal() {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Add New Address</h2>
                    <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="addAddressForm" onsubmit="app.handleAddAddress(event)" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Full Name</label>
                        <input type="text" name="fullName" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Phone</label>
                        <input type="tel" name="phone" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Address</label>
                        <textarea name="address" required class="w-full px-4 py-2 border rounded-lg"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">City</label>
                        <input type="text" name="city" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Postal Code</label>
                        <input type="text" name="postalCode" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Add Address
                    </button>
                </form>
            </div>
        `;
    }

    handleAddAddress(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const newAddress = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode')
        };

        // Initialize addresses array if it doesn't exist
        if (!this.currentUser.addresses) {
            this.currentUser.addresses = [];
        }

        // Add new address
        this.currentUser.addresses.push(newAddress);

        // Update user in USERS array
        const userIndex = USERS.findIndex(u => u.email === this.currentUser.email);
        if (userIndex !== -1) {
            USERS[userIndex] = this.currentUser;
        }

        // Save changes
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        saveToLocalStorage();

        this.closeModal();
        this.showProfile();
        this.showNotification('Address added successfully!');
    }

    deleteAddress(index) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.currentUser.addresses.splice(index, 1);
            
            // Update user in USERS array
            const userIndex = USERS.findIndex(u => u.email === this.currentUser.email);
            if (userIndex !== -1) {
                USERS[userIndex] = this.currentUser;
            }

            // Save changes
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            saveToLocalStorage();

            this.showProfile();
            this.showNotification('Address deleted successfully!');
        }
    }

    showChangePassword() {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.classList.remove('hidden');
        modalContainer.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Change Password</h2>
                    <button onclick="app.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="changePasswordForm" onsubmit="app.handleChangePassword(event)" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Current Password</label>
                        <input type="password" name="currentPassword" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">New Password</label>
                        <input type="password" name="newPassword" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" name="confirmPassword" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Change Password
                    </button>
                </form>
            </div>
        `;
    }

    handleChangePassword(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Find user
        const userIndex = USERS.findIndex(u => u.email === this.currentUser.email);
        if (userIndex === -1) {
            this.showNotification('User not found', 'error');
            return;
        }

        // Verify current password
        if (USERS[userIndex].password !== currentPassword) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }

        // Verify new passwords match
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        // Update password
        USERS[userIndex].password = newPassword;
        this.currentUser = USERS[userIndex];
        saveToLocalStorage();
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.closeModal();
        this.showNotification('Password changed successfully!');
    }

    // Add this method to the ShopApp class
    showAdminLogin() {
        // Update this method to properly navigate to admin.html
        window.location.href = './admin.html';
    }

    // Add this new method
    handlePopState(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            this.showProductDetails(parseInt(productId));
        } else {
            this.renderHomePage();
        }
    }

    // Add this new method
    updateLogo() {
        const logoUrl = localStorage.getItem('siteLogoUrl') || 'https://i.ibb.co/VvxBzzg/Co-Slim.png';
        document.querySelectorAll('img[alt="CoSlim Logo"]').forEach(img => {
            img.src = logoUrl;
        });
    }
}

const app = new ShopApp(); 