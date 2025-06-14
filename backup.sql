-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecomerce
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cartId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartId`),
  KEY `userId` (`userId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitem` (
  `cartItemId` int NOT NULL AUTO_INCREMENT,
  `cartId` int DEFAULT NULL,
  `productVariantId` int DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cartItemId`),
  KEY `cartId` (`cartId`),
  KEY `productVariantId` (`productVariantId`),
  CONSTRAINT `cartitem_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `cart` (`cartId`) ON DELETE CASCADE,
  CONSTRAINT `cartitem_ibfk_2` FOREIGN KEY (`productVariantId`) REFERENCES `productvariant` (`productVariantId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `imageId` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`imageId`),
  KEY `productId` (`productId`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `orderItemId` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `productVariantId` int DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`orderItemId`),
  KEY `orderId` (`orderId`),
  KEY `productVariantId` (`productVariantId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productVariantId`) REFERENCES `productvariant` (`productVariantId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) DEFAULT NULL,
  `userPayment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`orderId`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `paymentId` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `paymentMethod` enum('vnpay','stripe','cash') DEFAULT NULL,
  `paymentStatus` enum('paid','not paid') DEFAULT NULL,
  `transactionDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `paymentCode` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`paymentId`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `categoryId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  `price` decimal(15,2) NOT NULL,
  PRIMARY KEY (`productId`),
  KEY `categoryId` (`categoryId`),
  KEY `userId` (`userId`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`) ON DELETE SET NULL,
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productvariant`
--

DROP TABLE IF EXISTS `productvariant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productvariant` (
  `productVariantId` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` enum('S','M','L','XL','XXL') DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`productVariantId`),
  KEY `productId` (`productId`),
  CONSTRAINT `productvariant_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewId`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping` (
  `shippingId` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `carrier` varchar(100) DEFAULT NULL,
  `shippingAddress` text NOT NULL,
  PRIMARY KEY (`shippingId`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `wishListId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishListId`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-14 12:18:19
