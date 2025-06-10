use  ecomerce;
-- User Table
CREATE TABLE Users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    userName VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Category Table
CREATE TABLE Category (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    gender ENUM ("male", "female", "unisex"),
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Table
CREATE TABLE Product (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    categoryId INT,
    userId INT,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    price decimal(15,2),
    quantity INT NOT NULL,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(categoryId) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL
);

-- ProductVariant Table
CREATE TABLE ProductVariant (
    productVariantId INT PRIMARY KEY AUTO_INCREMENT,
    productId INT,
    color VARCHAR(50),
    size ENUM('S', 'M', 'L', 'XL', 'XXL'),
    quantity INT NOT NULL,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
);

-- Images Table
CREATE TABLE Images (
    imageId INT PRIMARY KEY AUTO_INCREMENT,
    productId INT,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
) ;

-- Review Table
CREATE TABLE Review (
    reviewId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    productId INT,
    comment TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
);

-- WishList Table
CREATE TABLE WishList (
    wishListId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    productId INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE CASCADE
);

-- Cart Table
CREATE TABLE Cart (
    cartId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- CartItem Table
CREATE TABLE CartItem (
    cartItemId INT PRIMARY KEY AUTO_INCREMENT,
    cartId INT,
    productVariantId INT,
    quantity INT NOT NULL,
    FOREIGN KEY (cartId) REFERENCES Cart(cartId) ON DELETE CASCADE,
    FOREIGN KEY (productVariantId) REFERENCES ProductVariant(productVariantId) ON DELETE CASCADE
);

-- Order Table
CREATE TABLE orders (
    orderId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL
);

-- OrderItem Table
CREATE TABLE orderitems (
    orderItemId INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT,
    productVariantId INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES `Order`(orderId) ON DELETE CASCADE,
    FOREIGN KEY (productVariantId) REFERENCES ProductVariant(productVariantId) ON DELETE SET NULL
);

-- Shipping Table
CREATE TABLE Shipping (
    shippingId INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT,
    carrier VARCHAR(100),
    shippingAddress TEXT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE
);

-- Payment Table
CREATE TABLE Payment (
    paymentId INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT,
    paymentMethod ENUM('stripe','cash_on_delivery') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES `Order`(orderId) ON DELETE SET NULL
);