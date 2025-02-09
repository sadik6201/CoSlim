const STORAGE_VERSION_KEY = 'SHOP_DATA_VERSION';

const SHOP_DATA = {
    banners: [
        {
            id: 1,
            image: "https://i.ibb.co/Xy1kmNt/online-shopping-banner.jpg",
            title: "SHOPPING ONLINE",
            subtitle: "Shop from the comfort of your home"
        },
        {
            id: 2,
            image: "https://i.ibb.co/G3jXB1n/mobile-case-banner.jpg",
            title: "Premium Mobile Cases",
            subtitle: "Protect your phone with style"
        }
    ],
    categories: [
        {
            id: 1,
            name: "Mobile Back Covers",
            image: "https://i.ibb.co/G3jXB1n/mobile-case-banner.jpg",
            description: "Stylish & Protective Cases"
        },
        {
            id: 2,
            name: "Tempered Glass",
            image: "https://i.ibb.co/tQbzM6Y/tempered-glass.jpg",
            description: "Screen Protection"
        },
        {
            id: 3,
            name: "Camera Protectors",
            image: "https://i.ibb.co/VjPBkXq/camera-protector.jpg",
            description: "Lens Protection"
        }
    ],
    products: [
        {
            id: 1,
            categoryId: 1,
            name: "iPhone 13 Pro Max Transparent Cover",
            price: 1499,
            description: "Premium quality transparent back cover with military-grade protection",
            images: [
                "https://i.ibb.co/ZX4Rph1/case1.jpg",
                "https://i.ibb.co/5RD3vN6/case2.jpg",
                "https://i.ibb.co/QQPmNjp/case3.jpg"
            ],
            stock: 50,
            specifications: {
                material: "TPU + Polycarbonate",
                color: "Transparent",
                compatibility: "iPhone 13 Pro Max"
            },
            brand: "Apple",
            model: "iPhone 13 Pro Max"
        },
        {
            id: 2,
            categoryId: 2,
            name: "11D Tempered Glass Screen Protector",
            price: 999,
            description: "Full coverage tempered glass with 11D protection",
            images: [
                "https://i.ibb.co/tQbzM6Y/tempered-glass.jpg",
                "https://i.ibb.co/C2zkznB/glass2.jpg",
                "https://i.ibb.co/mXK1gLg/glass3.jpg"
            ],
            stock: 100,
            specifications: {
                thickness: "0.3mm",
                hardness: "9H",
                type: "Full Coverage"
            }
        },
        {
            id: 3,
            categoryId: 3,
            name: "Camera Lens Protector",
            price: 699,
            description: "Premium camera lens protector with anti-scratch coating",
            images: [
                "https://i.ibb.co/VjPBkXq/camera-protector.jpg",
                "https://i.ibb.co/Lp7Gh8G/camera2.jpg",
                "https://i.ibb.co/3yzc9Kc/camera3.jpg"
            ],
            stock: 75,
            specifications: {
                material: "Tempered Glass",
                coverage: "Full Lens",
                coating: "Anti-fingerprint"
            }
        }
    ]
};

const USERS = [
    {
        email: "test@example.com",
        password: "password123", // In real app, this should be hashed
        name: "Test User",
        addresses: []
    }
];

// Update the PHONE_MODELS structure
const PHONE_MODELS = {
    Apple: {
        'iPhone 15 Series': [
            'iPhone 15 Pro Max',
            'iPhone 15 Pro',
            'iPhone 15 Plus',
            'iPhone 15'
        ],
        'iPhone 14 Series': [
            'iPhone 14 Pro Max',
            'iPhone 14 Pro',
            'iPhone 14 Plus',
            'iPhone 14'
        ],
        'iPhone 13 Series': [
            'iPhone 13 Pro Max',
            'iPhone 13 Pro',
            'iPhone 13',
            'iPhone 13 Mini'
        ],
        'iPhone 12 Series': [
            'iPhone 12 Pro Max',
            'iPhone 12 Pro',
            'iPhone 12',
            'iPhone 12 Mini'
        ],
        'iPhone 11 Series': [
            'iPhone 11 Pro Max',
            'iPhone 11 Pro',
            'iPhone 11'
        ],
        'iPhone X Series': [
            'iPhone XS Max',
            'iPhone XS',
            'iPhone XR',
            'iPhone X'
        ],
        'iPhone 8 Series': [
            'iPhone 8 Plus',
            'iPhone 8'
        ],
        'iPhone 7 Series': [
            'iPhone 7 Plus',
            'iPhone 7'
        ],
        'iPhone 6 Series': [
            'iPhone 6s Plus',
            'iPhone 6s',
            'iPhone 6 Plus',
            'iPhone 6'
        ],
        'iPhone SE Series': [
            'iPhone SE (3rd Gen)',
            'iPhone SE (2nd Gen)',
            'iPhone SE (1st Gen)'
        ]
    },
    Samsung: {
        'S Series': [
            'Galaxy S24 Ultra',
            'Galaxy S24+',
            'Galaxy S24',
            'Galaxy S23 Ultra',
            'Galaxy S23+',
            'Galaxy S23',
            'Galaxy S22 Ultra',
            'Galaxy S22+',
            'Galaxy S22',
            'Galaxy S21 Ultra',
            'Galaxy S21+',
            'Galaxy S21',
            'Galaxy S20 Ultra',
            'Galaxy S20+',
            'Galaxy S20'
        ],
        'Note Series': [
            'Galaxy Note 20 Ultra',
            'Galaxy Note 20',
            'Galaxy Note 10+',
            'Galaxy Note 10',
            'Galaxy Note 9',
            'Galaxy Note 8'
        ],
        'A Series': [
            'Galaxy A73',
            'Galaxy A54 5G',
            'Galaxy A53 5G',
            'Galaxy A34 5G',
            'Galaxy A33 5G',
            'Galaxy A23 5G',
            'Galaxy A14 5G',
            'Galaxy A04s'
        ],
        'M Series': [
            'Galaxy M54 5G',
            'Galaxy M53 5G',
            'Galaxy M34 5G',
            'Galaxy M33 5G',
            'Galaxy M14 5G',
            'Galaxy M04'
        ],
        'F Series': [
            'Galaxy F54 5G',
            'Galaxy F34 5G',
            'Galaxy F23 5G',
            'Galaxy F14 5G',
            'Galaxy F04'
        ]
    },
    Realme: {
        '12 Series': [
            'Realme 12+ 5G',
            'Realme 12 Pro+ 5G',
            'Realme 12 Pro 5G',
            'Realme 12x 5G',
            'Realme 12 5G'
        ],
        '11 Series': [
            'Realme 11 Pro+ 5G',
            'Realme 11 Pro 5G',
            'Realme 11x 5G',
            'Realme 11 5G'
        ],
        'Narzo Series': [
            'Narzo 70 Pro 5G',
            'Narzo 60x 5G',
            'Narzo 60 Pro 5G',
            'Narzo 60 5G',
            'Narzo N53',
            'Narzo N55'
        ],
        'GT Series': [
            'Realme GT 5 Pro',
            'Realme GT Neo 5 SE',
            'Realme GT Neo 5',
            'Realme GT 3 Pro',
            'Realme GT 3'
        ],
        'C Series': [
            'Realme C67 5G',
            'Realme C65',
            'Realme C55',
            'Realme C53',
            'Realme C51',
            'Realme C33'
        ]
    },
    Redmi: {
        'Note 13 Series': [
            'Redmi Note 13 Pro+ 5G',
            'Redmi Note 13 Pro 5G',
            'Redmi Note 13 5G'
        ],
        'Note 12 Series': [
            'Redmi Note 12 Pro+ 5G',
            'Redmi Note 12 Pro 5G',
            'Redmi Note 12 5G'
        ],
        'K Series': [
            'Redmi K70 Pro',
            'Redmi K70',
            'Redmi K60',
            'Redmi K50i'
        ],
        '13 Series': [
            'Redmi 13C'
        ],
        '12 Series': [
            'Redmi 12 5G',
            'Redmi 12C'
        ],
        '11 Series': [
            'Redmi 11 Prime'
        ],
        'A Series': [
            'Redmi A3',
            'Redmi A2+',
            'Redmi A2',
            'Redmi A1+'
        ]
    },
    OnePlus: {
        '12 Series': [
            'OnePlus 12R',
            'OnePlus 12'
        ],
        '11 Series': [
            'OnePlus 11R',
            'OnePlus 11'
        ],
        '10 Series': [
            'OnePlus 10 Pro',
            'OnePlus 10R',
            'OnePlus 10T'
        ],
        '9 Series': [
            'OnePlus 9 Pro',
            'OnePlus 9',
            'OnePlus 9R',
            'OnePlus 9RT'
        ],
        '8 Series': [
            'OnePlus 8 Pro',
            'OnePlus 8',
            'OnePlus 8T'
        ],
        '7 Series': [
            'OnePlus 7 Pro',
            'OnePlus 7',
            'OnePlus 7T Pro',
            'OnePlus 7T'
        ],
        '6 Series': [
            'OnePlus 6T',
            'OnePlus 6'
        ],
        'Nord Series': [
            'OnePlus Nord CE 4',
            'OnePlus Nord CE 3 5G',
            'OnePlus Nord CE 3 Lite',
            'OnePlus Nord CE 2 5G',
            'OnePlus Nord CE 2 Lite',
            'OnePlus Nord 2T',
            'OnePlus Nord N30'
        ]
    },
    Vivo: {
        'V Series': [
            'Vivo V29 Pro',
            'Vivo V29',
            'Vivo V27 Pro',
            'Vivo V27'
        ],
        'Y Series': [
            'Vivo Y200 5G',
            'Vivo Y100 5G',
            'Vivo Y56 5G',
            'Vivo Y27'
        ],
        'T Series': [
            'Vivo T2 Pro 5G',
            'Vivo T2x 5G',
            'Vivo T2 5G',
            'Vivo T1 5G'
        ]
    },
    OPPO: {
        'Reno Series': [
            'OPPO Reno 11 Pro 5G',
            'OPPO Reno 11 5G',
            'OPPO Reno 10 Pro+ 5G',
            'OPPO Reno 10 Pro 5G',
            'OPPO Reno 10 5G',
            'OPPO Reno 8T 5G'
        ],
        'F Series': [
            'OPPO F25 Pro 5G',
            'OPPO F23 5G',
            'OPPO F21s Pro',
            'OPPO F21 Pro',
            'OPPO F19 Pro+'
        ],
        'A Series': [
            'OPPO A79 5G',
            'OPPO A78 5G',
            'OPPO A77s',
            'OPPO A58 5G',
            'OPPO A38',
            'OPPO A17'
        ],
        'K Series': [
            'OPPO K11 5G',
            'OPPO K10 5G',
            'OPPO K10'
        ]
    },
    POCO: {
        'X Series': [
            'POCO X6 Pro 5G',
            'POCO X6 5G',
            'POCO X5 Pro 5G',
            'POCO X5 5G',
            'POCO X4 Pro 5G',
            'POCO X4 GT'
        ],
        'F Series': [
            'POCO F5 Pro 5G',
            'POCO F5 5G',
            'POCO F4 5G',
            'POCO F4 GT',
            'POCO F3'
        ],
        'M Series': [
            'POCO M6 Pro 5G',
            'POCO M6 5G',
            'POCO M5s',
            'POCO M5',
            'POCO M4 Pro'
        ],
        'C Series': [
            'POCO C65',
            'POCO C55',
            'POCO C51'
        ]
    },
    iQOO: {
        '12 Series': [
            'iQOO 12 Pro',
            'iQOO 12'
        ],
        '11 Series': [
            'iQOO 11 5G',
            'iQOO 11S'
        ],
        '9 Series': [
            'iQOO 9T 5G',
            'iQOO 9 Pro',
            'iQOO 9 SE'
        ],
        'Neo Series': [
            'iQOO Neo 9 Pro',
            'iQOO Neo 7 Pro 5G',
            'iQOO Neo 7 5G',
            'iQOO Neo 6 5G'
        ],
        'Z Series': [
            'iQOO Z9 5G',
            'iQOO Z7s 5G',
            'iQOO Z7 Pro 5G',
            'iQOO Z7 5G',
            'iQOO Z6 Lite 5G'
        ]
    },
    Infinix: {
        'Zero Series': [
            'Infinix Zero 30 5G',
            'Infinix Zero 30',
            'Infinix Zero 20'
        ],
        'GT Series': [
            'Infinix GT 10 Pro',
            'Infinix GT 10'
        ],
        'Note Series': [
            'Infinix Note 30 Pro',
            'Infinix Note 30 5G',
            'Infinix Note 30',
            'Infinix Note 12'
        ],
        'Hot Series': [
            'Infinix Hot 40i',
            'Infinix Hot 30 5G',
            'Infinix Hot 30 Play',
            'Infinix Hot 20 5G'
        ],
        'Smart Series': [
            'Infinix Smart 8',
            'Infinix Smart 7',
            'Infinix Smart 6'
        ]
    },
    Tecno: {
        'Phantom Series': [
            'Tecno Phantom V Flip',
            'Tecno Phantom X2 Pro',
            'Tecno Phantom X2'
        ],
        'Camon Series': [
            'Tecno Camon 20 Premier',
            'Tecno Camon 20 Pro 5G',
            'Tecno Camon 20 Pro',
            'Tecno Camon 20'
        ],
        'Pova Series': [
            'Tecno Pova 5 Pro 5G',
            'Tecno Pova 5',
            'Tecno Pova 4 Pro',
            'Tecno Pova 4'
        ],
        'Spark Series': [
            'Tecno Spark 20 Pro',
            'Tecno Spark 20',
            'Tecno Spark 10 Pro',
            'Tecno Spark 10'
        ]
    },
    Motorola: {
        'Edge Series': [
            'Motorola Edge 40 Pro',
            'Motorola Edge 40 Neo',
            'Motorola Edge 40',
            'Motorola Edge 30 Ultra',
            'Motorola Edge 30 Pro',
            'Motorola Edge 30'
        ],
        'G Series': [
            'Moto G84 5G',
            'Moto G54 5G',
            'Moto G32',
            'Moto G23',
            'Moto G14',
            'Moto G13'
        ],
        'E Series': [
            'Moto E13',
            'Moto E32s',
            'Moto E32',
            'Moto E22s'
        ]
    },
    Nothing: {
        'Phone Series': [
            'Nothing Phone (2a)',
            'Nothing Phone (2)',
            'Nothing Phone (1)'
        ]
    },
    Asus: {
        'ROG Series': [
            'ROG Phone 8 Pro',
            'ROG Phone 8',
            'ROG Phone 7 Ultimate',
            'ROG Phone 7',
            'ROG Phone 6'
        ],
        'Zenfone Series': [
            'Zenfone 10',
            'Zenfone 9',
            'Zenfone 8'
        ]
    }
};

// Add admin credentials
const ADMIN_USERS = [
    {
        email: "admin@coslim.com",
        password: "admin123", // In a real app, this should be hashed
        name: "Admin User",
        role: "super_admin"
    }
];

// Add this to data.js
const ORDERS = [
    {
        id: 1,
        userId: 1,
        userEmail: "test@example.com",
        products: [
            {
                productId: 1,
                quantity: 2,
                price: 1499
            }
        ],
        total: 2998,
        status: 'pending',
        date: '2024-03-15'
    }
];

// Add this to SHOP_DATA structure
const REVIEWS = {
    // Product ID as key
    1: [
        {
            id: 1,
            userId: 1,
            userName: "John Doe",
            rating: 5,
            comment: "Great product! Perfect fit for my iPhone.",
            date: "2024-03-15",
            verified: true
        }
    ]
};

// Initialize ORDERS if not exists
if (!window.ORDERS) {
    window.ORDERS = [];
}

// Modify saveToLocalStorage function
function saveToLocalStorage() {
    try {
        // Save data
        localStorage.setItem('SHOP_DATA', JSON.stringify(SHOP_DATA));
        localStorage.setItem('USERS', JSON.stringify(USERS));
        localStorage.setItem('ORDERS', JSON.stringify(window.ORDERS));
        localStorage.setItem('ADMIN_USERS', JSON.stringify(ADMIN_USERS));
        
        // Update version timestamp
        localStorage.setItem(STORAGE_VERSION_KEY, Date.now().toString());
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Update loadFromLocalStorage function
function loadFromLocalStorage() {
    try {
        const savedShopData = localStorage.getItem('SHOP_DATA');
        const savedUsers = localStorage.getItem('USERS');
        const savedOrders = localStorage.getItem('ORDERS');
        const savedAdminUsers = localStorage.getItem('ADMIN_USERS');

        if (savedShopData) Object.assign(SHOP_DATA, JSON.parse(savedShopData));
        if (savedUsers) Object.assign(USERS, JSON.parse(savedUsers));
        if (savedOrders) window.ORDERS = JSON.parse(savedOrders);
        if (savedAdminUsers) {
            // Replace ADMIN_USERS array with saved data
            const parsedAdminUsers = JSON.parse(savedAdminUsers);
            ADMIN_USERS.length = 0; // Clear array
            ADMIN_USERS.push(...parsedAdminUsers); // Add saved users
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize data
loadFromLocalStorage();

// Add these constants at the top
const CHECK_UPDATES_INTERVAL = 5000; // Check every 5 seconds
const API_VERSION_URL = 'check-updates.php';

// Modify the checkForUpdates function
function checkForUpdates() {
    fetch(API_VERSION_URL + '?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            const localVersion = localStorage.getItem(STORAGE_VERSION_KEY) || '0';
            if (data.version > parseInt(localVersion)) {
                console.log('New version detected, updating data...');
                // Force reload all data from server
                loadFromLocalStorage();
                // Refresh the page to show new content
                window.location.reload();
            }
        })
        .catch(error => console.error('Error checking updates:', error));
}

// Add this function to initialize periodic updates
function initializeUpdates() {
    // Check for updates immediately
    checkForUpdates();
    // Then check periodically
    setInterval(checkForUpdates, CHECK_UPDATES_INTERVAL);
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', initializeUpdates); 