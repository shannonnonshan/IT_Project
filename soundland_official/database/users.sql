-- ----------------------------
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
  `githubId` varchar(255),
  `googleId` varchar(255),
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






-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CatID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CatName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`CatID`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert music categories
INSERT INTO `categories` (`CatName`) VALUES
('Pop'),
('Rock'),
('Hip Hop'),
('Jazz'),
('Classical'),
('Electronic'),
('Country'),
('Reggae'),
('Blues'),
('Folk'),
('R&B'),
('Soul'),
('Heavy Metal'),
('Punk'),
('Alternative'),
('Indie'),
('Disco'),
('Dance'),
('Techno'),
('Opera'),
('Gospel');


-- ----------------------------
-- Table structure for artists
-- ----------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `ArtistID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ArtistName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ArtistID`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert artists
INSERT INTO `artists` (`ArtistName`) VALUES
('MOPIUS'),
('JENNIE'),
('BIGBANG'),
('ROSE'),
('JISOO'),
('G-DRAGON'),
('PHƯƠNG MỸ CHI'),
('Billie Eilish'),
('Mono'),
('EXO'),
('Isaac Hong'),
('Newjeans'),
('illit'),
('LEE YOUNGJI'),
('D.O'),
('GRACIE ABRAMS'),
('Bruno Mars'),
('TREASURE'),
('Mariah Carey'),
('Adele'),
('Taylor Swift'),
('BLACKPINK'),
('Harry Styles'),
('IU'),
('Justin Bieber'),
('Sơn Tùng M-TP'),
('Doja Cat'),
('Lady Gaga'),
('The Weeknd'),
('Charlie Puth'),
('BLACKPINK'), ('Ed Sheeran'), ('Adele'), ('Red Velvet'), ('BTS'), ('Justin Bieber'), ('TobyMac'), ('Beyoncé'), ('Bruno Mars'), ('Taylor Swift'), ('MAMAMOO'), ('Katy Perry'), ('Eagles'), ('HIEUTHUHAI'), ('AMEE'), ('Wren Evans'), ('Obito');


-- ----------------------------
-- Table structure for albums
-- ----------------------------
DROP TABLE IF EXISTS `albums`;
CREATE TABLE `albums` (
  `AlbumID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `AlbumName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ReleaseDate` date NOT NULL,
  PRIMARY KEY (`AlbumID`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert dữ liệu vào bảng albums
INSERT INTO `albums` (`AlbumName`, `ReleaseDate`) VALUES
-- US-UK & Kpop
('Born Pink', '2022-09-16'),              -- BLACKPINK
('Divide', '2017-03-03'),                 -- Ed Sheeran
('25', '2015-11-20'),                     -- Adele
('The Red', '2015-09-09'),                -- Red Velvet
('Map of the Soul: 7', '2020-02-21'),     -- BTS
('Purpose', '2015-11-13'),                -- Justin Bieber
('Eye on It', '2012-08-28'),              -- TobyMac
('Dangerously in Love', '2003-06-24'),    -- Beyoncé
('The Album', '2020-10-02'),              -- BLACKPINK
('Unorthodox Jukebox', '2012-12-07'),     -- Bruno Mars
('Lover', '2019-08-23'),                  -- Taylor Swift
('Wings', '2016-10-10'),                  -- BTS
('Yellow Flower', '2018-03-07'),          -- MAMAMOO
('Teenage Dream', '2010-08-24'),          -- Katy Perry
('Hotel California', '1976-12-08'),      -- Eagles

-- Việt Nam
('Trạm Cảm Xúc', '2023-02-14'),           -- HIEUTHUHAI
('DreAMEE', '2020-06-15'),                -- AMEE
('Freaky Squad', '2021-12-20'),           -- Wren Evans
('Lost In Mind', '2023-04-10'),           -- Obito
('Chiếc Hộp Pandora', '2023-09-01');      -- AMEE

DROP TABLE IF EXISTS `album_artists`;
CREATE TABLE `album_artists` (
  `AlbumID` int(11) NOT NULL,      -- ID của album
  `ArtistID` int(11) NOT NULL,     -- ID của nghệ sĩ
  PRIMARY KEY (`AlbumID`, `ArtistID`), -- Khóa chính kết hợp
  FOREIGN KEY (`AlbumID`) REFERENCES `albums`(`AlbumID`) ON DELETE CASCADE, -- Liên kết đến bảng albums
  FOREIGN KEY (`ArtistID`) REFERENCES `artists`(`ArtistID`) ON DELETE CASCADE -- Liên kết đến bảng artists
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- Insert dữ liệu vào bảng album_artists
INSERT INTO `album_artists` (`AlbumID`, `ArtistID`) VALUES
-- US-UK & Kpop
(1, 22),  -- Born Pink - BLACKPINK
(2, 31), -- Divide - Ed Sheeran
(3, 20), -- 25 - Adele
(4, 32), -- The Red - Red Velvet
(5, 33), -- Map of the Soul: 7 - BTS
(6, 25), -- Purpose - Justin Bieber
(7, 34), -- Eye on It - TobyMac
(8, 35), -- Dangerously in Love - Beyoncé
(9, 22),  -- The Album - BLACKPINK
(10, 17),-- Unorthodox Jukebox - Bruno Mars
(11, 21),-- Lover - Taylor Swift
(12, 33),-- Wings - BTS
(13, 36),-- Yellow Flower - MAMAMOO
(14, 37),-- Teenage Dream - Katy Perry
(15, 38),-- Hotel California - Eagles

-- Việt Nam
(16, 39),  -- Trạm Cảm Xúc - HIEUTHUHAI
(17, 40),  -- DreAMEE - AMEE
(18, 41),  -- Freaky Squad - Wren Evans
(19, 42),  -- Lost In Mind - Obito
(20, 40);  -- Chiếc Hộp Pandora - AMEE


-- ----------------------------
-- Table structure for songs
-- ----------------------------
DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
  `SongID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `SongName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `CatID` int(11) NOT NULL,
  `ReleaseDate` date NOT NULL,
  `Views` INT DEFAULT 0, -- Số lượt nghe 
  `CreatedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo 
  `UpdatedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Ngày cập nhật cuối cùng
  PRIMARY KEY (`SongID`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert songs
-- Insert dữ liệu vào bảng products
INSERT INTO `songs` (`SongName`, `CatID`, `ReleaseDate`) VALUES
('Làn ưu tiên', 1, '2024-01-01'),                     -- Mopius
('Number one girl', 1, '2023-12-15'),                 -- ROSE
('All I want for Christmas is you', 3, '1994-11-01'), -- Mariah Carey
('First snow', 4, '2023-12-20'),                      -- EXO
('Chăm hoa', 5, '2024-02-14'),                        -- Mono
('Small girl', 1, '2024-03-01'),                      -- Lee YoungJi ft. D.O
('Wildflower', 6, '2023-11-11'),                      -- Billie Eilish
('That’s so true', 7, '2024-01-10'),                  -- Gracie Abrams
('Fallin’', 8, '2020-09-05'),                         -- Isaac Hong
('Magnetic', 9, '2024-05-20'),                        -- illit
('Ditto', 1, '2024-06-15'),                           -- Newjeans
('Power', 10, '2017-09-05'),                          -- G-DRAGON
('Untitled (2024)', 11, '2024-08-01'),                -- G-DRAGON
('Mantra', 6, '2024-03-22'),                          -- JENNIE
('Flower', 1, '2024-04-25'),                          -- JISOO
('Bang Bang Bang', 6, '2015-06-01'),                  -- BIGBANG
('Lovely', 8, '2018-04-19'),                          -- Billie Eilish
('Bóng phù hoa', 5, '2024-05-05'),                    -- Phương Mỹ Chi
('Treasure', 9, '2024-02-14'),                        -- Bruno Mars
('Darari', 9, '2022-01-11');                          -- Treasure



-- Bảng song_artists để lưu quan hệ bài hát và nghệ sĩ
DROP TABLE IF EXISTS `song_artists`;
CREATE TABLE `song_artists` (
  `SongID` int(11) NOT NULL,      -- ID bài hát
  `ArtistID` int(11) NOT NULL,    -- ID nghệ sĩ
  PRIMARY KEY (`SongID`, `ArtistID`), -- Khóa chính kết hợp
  FOREIGN KEY (`SongID`) REFERENCES `products`(`SongID`),  -- Liên kết tới bảng products
  FOREIGN KEY (`ArtistID`) REFERENCES `artists`(`ArtistID`) -- Liên kết tới bảng artists
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Insert dữ liệu vào bảng song_artists
INSERT INTO `song_artists` (`SongID`, `ArtistID`) VALUES
(1, 1),  -- Làn ưu tiên, Mopius
(2, 4),  -- Number one girl, ROSE
(3, 20), -- All I want for Christmas is you, Mariah Carey
(4, 10), -- First snow, EXO
(5, 9),  -- Chăm hoa, Mono
(6, 15), -- Small girl, Lee YoungJi
(6, 16), -- Small girl, D.O
(7, 8),  -- Wildflower, Billie Eilish
(8, 17), -- That’s so true, Gracie Abrams
(9, 11), -- Fallin’, Isaac Hong
(10, 13), -- Magnetic, illit
(11, 12), -- Ditto, Newjeans
(12, 5),  -- Power, G-DRAGON
(13, 5),  -- Untitled (2024), G-DRAGON
(14, 2),  -- Mantra, JENNIE
(15, 3),  -- Flower, JISOO
(16, 6),  -- Bang Bang Bang, BIGBANG
(17, 8),  -- Lovely, Billie Eilish
(18, 7),  -- Bóng phù hoa, Phương Mỹ Chi
(19, 18), -- Treasure, Bruno Mars
(20, 19); -- Darari, Treasure


