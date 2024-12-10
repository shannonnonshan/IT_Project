CREATE DATABASE IF NOT EXISTS soundLandDB
CHARACTER SET utf8
COLLATE utf8_unicode_ci;


-- Sử dụng cơ sở dữ liệu vừa tạo
USE soundLandDB;

-- Xóa bảng nếu tồn tại
DROP TABLE IF EXISTS `userRefreshTokenExt`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `artists`;
DROP TABLE IF EXISTS `albums`;
DROP TABLE IF EXISTS `album_artists`;
DROP TABLE IF EXISTS `songs`;
DROP TABLE IF EXISTS `song_artists`;

-- Bảng categories
CREATE TABLE `categories` (
  `CatID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CatName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`CatID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Bảng users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `githubId` varchar(255),
  `googleId` varchar(255),
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Cột name
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  `NoOfFollower` int(11) DEFAULT 0,    -- Số người theo dõi
  `NoOfFollowing` int(11) DEFAULT 0,  -- Số người đang theo dõi
  `PublicPlaylist` int(11) DEFAULT 0, -- Số playlist công khai
  PRIMARY KEY (`id`),
  UNIQUE (`name`) -- Thêm chỉ mục UNIQUE cho cột name
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `userRefreshTokenExt` (
  `ID` int(11) NOT NULL,
  `RefreshToken` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rdt` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`ID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tạo bảng artists
CREATE TABLE `artists` (
  `ArtistID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ArtistName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci, -- Cột này liên kết với bảng users
  PRIMARY KEY (`ArtistID`),
  FOREIGN KEY (`name`) REFERENCES `users`(`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Bảng albums
CREATE TABLE `albums` (
  `AlbumID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `AlbumName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ReleaseDate` date NOT NULL,
  PRIMARY KEY (`AlbumID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Bảng album_artists (liên kết artists và albums)
CREATE TABLE `album_artists` (
  `AlbumID` int(11) unsigned NOT NULL, -- Cột này phải là unsigned
  `ArtistID` int(11) unsigned NOT NULL, -- Cột này phải là unsigned
  PRIMARY KEY (`AlbumID`, `ArtistID`), -- Khóa chính kết hợp
  FOREIGN KEY (`AlbumID`) REFERENCES `albums`(`AlbumID`) ON DELETE CASCADE ON UPDATE CASCADE, -- Ràng buộc khóa ngoại
  FOREIGN KEY (`ArtistID`) REFERENCES `artists`(`ArtistID`) ON DELETE CASCADE ON UPDATE CASCADE -- Ràng buộc khóa ngoại
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Bảng songs
CREATE TABLE `songs` (
  `SongID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `SongName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `CatID` int(11) unsigned NOT NULL, -- Phải là unsigned để khớp với bảng categories
  `ReleaseDate` date NOT NULL,
  `AlbumID` int(11) unsigned DEFAULT NULL, -- Phải là unsigned để khớp với bảng albums
  `Views` INT DEFAULT 0, -- Số lượt nghe
  `CreatedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo
  `UpdatedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Ngày cập nhật cuối cùng
  PRIMARY KEY (`SongID`),
  FOREIGN KEY (`CatID`) REFERENCES `categories`(`CatID`) ON DELETE CASCADE ON UPDATE CASCADE, -- Liên kết với bảng categories
  FOREIGN KEY (`AlbumID`) REFERENCES `albums`(`AlbumID`) ON DELETE SET NULL ON UPDATE CASCADE -- Liên kết album
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Bảng song_artists (liên kết songs và artists)
CREATE TABLE `song_artists` (
  `SongID` int(11) unsigned NOT NULL, -- Phải là unsigned
  `ArtistID` int(11) unsigned NOT NULL, -- Phải là unsigned
  PRIMARY KEY (`SongID`, `ArtistID`), -- Khóa chính kết hợp
  FOREIGN KEY (`SongID`) REFERENCES `songs`(`SongID`) ON DELETE CASCADE ON UPDATE CASCADE, -- Ràng buộc khóa ngoại
  FOREIGN KEY (`ArtistID`) REFERENCES `artists`(`ArtistID`) ON DELETE CASCADE ON UPDATE CASCADE -- Ràng buộc khóa ngoại
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Tạo dữ liệu
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
('Ed Sheeran'), ('Red Velvet'), ('BTS'), ('TobyMac'), ('Beyoncé'), ('Bruno Mars'), ('MAMAMOO'), ('Katy Perry'), ('Eagles'), ('HIEUTHUHAI'), ('AMEE'), ('Wren Evans'), ('Obito'), ('Many singers');


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
('Chiếc Hộp Pandora', '2023-09-01'),      -- AMEE
-- Bổ sung
('Rosie', '2024-12-06'),                  -- Rose
('Merry Christmas', '1994-10-29'),       -- Mariah Carey
('The First Snow', '2023-12-20'),        -- EXO
('16 Fantasy', '2024-06-21'),            -- LEE YOUNGJI
('Hit Me Hard and Soft', '2024-05-17'),  -- Billie Eilish
('The Secret of Us (Deluxe)', '2024-06-21'), -- Gracie Abrams
('Super Real Me', '2024-03-25'),         -- illit
('Kwon Ji Yong', '2017-06-08'),          -- G-Dragon
('Made', '2015-06-01'),                  -- BIG BANG
('13 Reasons Why: Season 2', '2018-04-26'), -- Many singers
('Vũ trụ cò bay', '2023-09-18'),         -- Phương Mỹ Chi
('THE SECOND STEP : CHAPTER ONE', '2022-05-12'); -- TREASURE
INSERT INTO `album_artists` (`AlbumID`, `ArtistID`) VALUES
-- US-UK & Kpop
(1, 22),  -- Born Pink - BLACKPINK
(2, 31),  -- Divide - Ed Sheeran
(3, 20),  -- 25 - Adele
(4, 32),  -- The Red - Red Velvet
(5, 33),  -- Map of the Soul: 7 - BTS
(6, 25),  -- Purpose - Justin Bieber
(7, 34),  -- Eye on It - TobyMac
(8, 35),  -- Dangerously in Love - Beyoncé
(9, 22),  -- The Album - BLACKPINK
(10, 17), -- Unorthodox Jukebox - Bruno Mars
(11, 21), -- Lover - Taylor Swift
(12, 33), -- Wings - BTS
(13, 37), -- Yellow Flower - MAMAMOO
(14, 38), -- Teenage Dream - Katy Perry
(15, 39), -- Hotel California - Eagles

-- Việt Nam
(16, 40),  -- AI CŨNG BẮT ĐẦU TỪ ĐÂU ĐÓ - HIEUTHUHAI
(17, 41),  -- DreAMEE - AMEE
(18, 42),  -- LOI CHOI: The Neo Pop Punk - Wren Evans
(19, 43),  -- Đánh đổi - Obito
(20, 41),  -- MỘNGMEE - AMEE

-- Bổ sung dữ liệu mới
(21, 4),  -- Rosie - Rose
(22, 19),  -- Merry Christmas - Mariah Carey
(23, 10),  -- The First Snow - EXO
(24, 14),  -- 16 Fantasy - LEE YOUNGJI
(25, 8),   -- Hit Me Hard and Soft - Billie Eilish
(26, 16),  -- The Secret of Us (Deluxe) - Gracie Abrams
(27, 13),  -- Super Real Me - illit
(28, 6),   -- Kwon Ji Yong - G-Dragon
(29, 3),   -- Made - BIGBANG
(30, 44),  -- 13 Reasons Why: Season 2 - Many singers
(31, 7),   -- Vũ trụ cò bay - Phương Mỹ Chi
(32, 18);  -- THE SECOND STEP : CHAPTER ONE - TREASURE

-- Insert songs
-- Insert dữ liệu vào bảng products
INSERT INTO `songs` (`SongName`, `CatID`, `ReleaseDate`, `AlbumID`) VALUES
('Làn ưu tiên', 1, '2024-01-01', NULL),                     -- Mopius
('Number one girl', 1, '2023-12-15', 21),                  -- ROSE
('All I want for Christmas is you', 3, '1994-11-01', 22),  -- Mariah Carey
('First snow', 4, '2023-12-20', 23),                       -- EXO
('Chăm hoa', 5, '2024-02-14', NULL),                       -- Mono
('Small girl', 1, '2024-03-01', 24),                       -- Lee YoungJi ft. D.O
('Wildflower', 6, '2023-11-11', 25),                       -- Billie Eilish
('That’s so true', 7, '2024-01-10', 26),                   -- Gracie Abrams
('Fallin’', 8, '2020-09-05', NULL),                        -- Isaac Hong
('Magnetic', 9, '2024-05-20', 27),                         -- illit
('Ditto', 1, '2024-06-15', NULL),                          -- Newjeans
('Power', 10, '2017-09-05', NULL),                         -- G-DRAGON
('Untitled (2024)', 11, '2024-08-01', 28),                 -- G-DRAGON
('Mantra', 6, '2024-03-22', NULL),                         -- JENNIE
('Flower', 1, '2024-04-25', NULL),                         -- JISOO
('Bang Bang Bang', 6, '2015-06-01', 29),                   -- BIGBANG
('Lovely', 8, '2018-04-19', 29),                           -- Billie Eilish
('Bóng phù hoa', 5, '2024-05-05', 31),                     -- Phương Mỹ Chi
('Treasure', 9, '2024-02-14', 10),                         -- Bruno Mars
('Darari', 9, '2022-01-11', 32),                         -- Treasure
('stay a little longer', 1, '2024-06-12', 21),                         -- ROSE
('two years', 6, '2024-06-12', 21),                   -- ROSE
('dance all night', 8, '2024-06-12', 21),                           -- ROSE
('3am', 5, '2024-06-12', 21),                     -- ROSE
('toxic till the end', 9, '2024-06-12', 21),                         -- ROSE
('drinks or coffee', 9, '2024-06-12', 21),                           -- ROSE
('pink venom', 1, '2022-09-16', 1),                         -- Blackpink
('shut down', 6, '2022-09-16', 1),                   -- Blackpink
('typa girl', 8, '2022-09-16', 1),                           -- Blackpink
('the happiest girl', 5, '2022-09-16', 1),                     -- Blackpink
('Hard To Love', 9, '2022-09-16', 1),                         -- Blackpink
('tally', 9, '2022-09-16', 1);    

INSERT INTO `song_artists` (`SongID`, `ArtistID`) VALUES
(1, 1),
(2, 4),
(3, 19);
INSERT INTO `song_artists` (`SongID`, `ArtistID`) VALUES
(4, 10),
(5, 9),
(6, 14),
(6, 15),
(7, 8),
(8, 16),
(9, 11),
(10, 13),
(11, 12),
(12, 6),
(13, 6),
(14, 2),
(15, 5),
(16, 3),
(17, 8),
(18, 7),
(19, 17),
(20, 18),
(21, 4),
(22, 4),
(23, 4),
(24, 4),
(25, 4),
(26, 4);
INSERT INTO `song_artists` (`SongID`, `ArtistID`) VALUES
(27, 22),
(28, 22),
(29, 22),
(30, 22),
(31, 22),
(32, 22);





