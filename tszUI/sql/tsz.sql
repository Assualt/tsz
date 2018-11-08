-- 创建数据库 tsz

-- DROP DATABASE IF EXISTS `tsz`;

-- CREATE DATABASE `tsz`;


-- table tsz_book --

CREATE TABLE `tsz_book`
(
  `book_id`           INT    NOT NULL , -- 图书唯一标识符
  `book_img_url`      VARCHAR(50), -- 图书的图片地址
  `book_price_before` DOUBLE DEFAULT 0.00 NOT NULL, -- 图书的原价
  `book_edition`      INT DEFAULT 0 NOT NULL , -- 图书的版次
  `book_store_name`   VARCHAR(30) NOT NULL , -- 图书书店名称
  `book_description`  TEXT NOT NULL , #-- 图书描述信息
  `book_price_now`    DOUBLE DEFAULT 0.00 NOT NULL, -- 图书现价
  `book_seller_id`    INT NOT NULL DEFAULT 0, -- 图书售卖书店id
  `book_name`         VARCHAR(50)  NOT NULL DEFAULT '', -- 图书名
  `book_uni`          VARCHAR(20)  NOT NULL , -- 图书售卖书店所在学校
  `book_author`       VARCHAR(20)  NOT NULL , -- 图书作者
  `book_seller`       VARCHAR(12)  NOT NULL , -- 图书售卖店家名
  `book_tags`         VARCHAR(50)  NOT NULL   -- 图书的标签  tag1;tag2;tag3;

)ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- tsz_user

CREATE TABLE `tsz_user`
(
  `user_id`  INT AUTO_INCREMENT NOT NULL PRIMARY KEY , -- 用户ID
  `user_name` VARCHAR(20) NOT NULL , -- 用户名
  `user_uni`  VARCHAR(20) NOT NULL , -- 用户所在学校
  `user_desc` TEXT  NOT NULL , -- 用户其他信息
  `user_address`  VARCHAR(50) NOT NULL , -- 用户地址
  `user_phone`  VARCHAR(11) NOT NULL , -- 用户联系电话
  `user_sex`    ENUM('男','女','保密') DEFAULT '男' NOT NULL ,-- 用户性别
  `user_age`    INT CHECK(`user_age` > 0 and `user_age` < 150)  -- 用户年龄
)ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=10000;

CREATE TABLE `tsz_user_address`
(
  `addr_id`   INT NOT NULL AUTO_INCREMENT PRIMARY KEY , -- 地址索引
  `addr_user_id` INT NOT NULL NOT NULL ,                -- 用户ID
  `addr_user_province` VARCHAR(20) NOT NULL, -- 用户所在省份
  `addr_user_district` VARCHAR(20) NOT NULL, -- 收件地址区
  `addr_user_more_detail` VARCHAR(100) DEFAULT '', -- 收件人详细地址
  `addr_user_phone`       VARCHAR(11) NOT NULL , -- 收件人电话
  `addr_user_name`        VARCHAR(20) NOT NULL , -- 用户姓名
  `addr_user_default`     BOOL DEFAULT FALSE -- 是否为默认地址

)ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;