-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS soundLandDB
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE soundLandDB;

-- Bảng users
-- Đổi engine của bảng users sang InnoDB
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tạo lại bảng userRefreshTokenExt với khóa ngoại hợp lệ
DROP TABLE IF EXISTS `userRefreshTokenExt`;
CREATE TABLE `userRefreshTokenExt` (
  `ID` int(11) NOT NULL,
  `RefreshToken` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rdt` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`ID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

