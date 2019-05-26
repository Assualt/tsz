-- 创建数据库 tsz
-- DROP DATABASE IF EXISTS `tsz`;
-- CREATE DATABASE `tsz`;
-- table tsz_book --

CREATE TABLE `tsz_book`
(
  `book_id`           INT NOT NULL primary key		comment '图书唯一标识符',
  `book_img_url`      VARCHAR(50) DEFAULT NULL		comment '图书的图片地址',
  `book_edition`      INT DEFAULT 0 NOT NULL 		comment '图书的版次',
  `book_description`  TEXT DEFAULT NULL   			comment '图书描述信息',
  `book_publish`	  VARCHAR(100) NOT NULL         comment '图书的出版社',
  `book_price`		  DOUBLE DEFAULT 0.00 NOT NULL	comment '图书定价',
  `book_name`         VARCHAR(120) NOT NULL 		comment '图书名',
  `book_author_chief` VARCHAR(50)  NOT NULL 		comment '图书作者',
  `book_author_other` VARCHAR(200) DEFAULT NULL     comment '图书其他作者', -- author1;author2;author3
  `book_tags`         VARCHAR(50)  NOT NULL   		comment '图书的标签' --  tag1;tag2;tag3;
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- tsz_user

CREATE TABLE `tsz_user`
(
  `user_id`			INT AUTO_INCREMENT NOT NULL PRIMARY KEY comment '用户ID',
  `user_name` 		VARCHAR(50) NOT NULL 				 	comment '用户名',
  `user_nichen`		VARCHAR(50) NOT NULL					comment '用户昵称',		
  `user_uni`  		VARCHAR(20) DEFAULT NULL 				comment '用户所在学校',
  `user_desc` 		TEXT DEFAULT NULL						comment '用户其他信息',
  `user_address`	TEXT DEFAULT NULL 						comment	'用户地址',
  `user_addIndex`	INT DEFAULT 0 NOT NULL					comment '用户地址索引',
  `user_otheraddIndex` VARCHAR(50) DEFAULT NULL	   			comment '用户其他地址索引', -- addr1; addr2
  `user_phone`  	VARCHAR(11) NOT NULL 					comment '用户联系电话',
  `user_sex`    	ENUM('男','女','保密') DEFAULT '男' NOT NULL comment '用户性别',
  `user_age`    	INT CHECK(`user_age` > 0 and `user_age` < 150 )  -- comment '用户年龄'
)ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=10000;

-- table tsz_user_address

CREATE TABLE `tsz_user_address`
(
  `addr_id`   			INT NOT NULL AUTO_INCREMENT PRIMARY KEY comment '地址索引',
  `addr_user_id` 		INT NOT NULL NOT NULL                 	comment '用户ID',
  `addr_province` 		VARCHAR(20) NOT NULL					comment '地址所在省份',
  `addr_city`			VARCHAR(20) DEFAULT NULL				comment '地址所在城市',
  `addr_user_more_detail` TEXT DEFAULT NULL						comment '收件人详细地址',
  `addr_user_phone`       VARCHAR(11) NOT NULL 					comment '收件人电话'
)ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE `tsz_user_pswd`
(
  `user_id` 			INT AUTO_INCREMENT NOT NULL PRIMARY KEY comment '用户ID',
  `user_pass`			VARCHAR(64) NOT NULL					comment '用户密码MD5(64)',
  `user_token`			VARCHAR(32) DEFAULT NULL 				comment '用户登录Token下发',
  `login_stat`          ENUM('Online','Offline','Other') DEFAULT 'Offline' comment '用户登录状态'
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

select * from tsz_user_address;
select * from tsz_user_pswd;