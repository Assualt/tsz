PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
	id INTEGER NOT NULL, 
	username VARCHAR NOT NULL, 
	email VARCHAR NOT NULL, 
	hashed_password VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	PRIMARY KEY (id)
);
INSERT INTO users VALUES(1,'admin','admin@admin.com','$2b$12$UMfH5frIAIL8vFRNiPhg0.e4xgbhTPbZVVMO2ruoNC2mDH7LLQaHe',1,1);
CREATE TABLE stations (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	address VARCHAR NOT NULL, 
	city_id INTEGER NOT NULL, 
	code VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	open_date DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	description VARCHAR, 
	keyword VARCHAR, 
	level INTEGER, 
	PRIMARY KEY (id)
);
INSERT INTO stations VALUES(1,'北京南站','北京市丰台区车站路1号',1,'BJP',1,'2008-08-01 00:00:00.000000','2026-04-08 21:49:32.226887','2026-04-08 22:29:47.776291','北京南站是中国最大的高铁站之一','北京,南站,高铁',1);
INSERT INTO stations VALUES(2,'北京站','北京市东城区毛家湾胡同13号',1,'BJPZ',1,'1959-09-14 00:00:00.000000','2026-04-08 21:49:32.226892','2026-04-08 21:49:32.226893','北京站是北京最古老的火车站之一','北京,站,火车站',0);
INSERT INTO stations VALUES(3,'北京西站','北京市丰台区莲花池东路',1,'BJXZ',1,'1996-01-21 00:00:00.000000','2026-04-08 21:49:32.226893','2026-04-08 21:49:32.226894','北京西站是北京重要的铁路枢纽','北京,西站,火车站',0);
INSERT INTO stations VALUES(4,'上海虹桥站','上海市闵行区申贵路1500号',2,'SHH',1,'2010-07-01 00:00:00.000000','2026-04-08 21:49:32.226894','2026-04-08 21:49:32.226895','上海虹桥站是上海最大的高铁站','上海,虹桥,高铁',0);
INSERT INTO stations VALUES(5,'上海站','上海市静安区秣陵路303号',2,'SHHZ',1,'1908-04-01 00:00:00.000000','2026-04-08 21:49:32.226895','2026-04-08 21:49:32.226896','上海站是上海的主要火车站之一','上海,站,火车站',0);
INSERT INTO stations VALUES(6,'广州南站','广州市番禺区石壁街道',3,'GZP',1,'2010-12-30 00:00:00.000000','2026-04-08 21:49:32.226896','2026-04-08 21:49:32.226897','广州南站是华南地区最大的高铁站','广州,南站,高铁',0);
INSERT INTO stations VALUES(7,'广州站','广州市越秀区环市西路159号',3,'GZQ',1,'1974-04-12 00:00:00.000000','2026-04-08 21:49:32.226897','2026-04-08 21:49:32.226898','广州站是广州的主要火车站','广州,站,火车站',0);
INSERT INTO stations VALUES(8,'深圳北站','深圳市龙华区致远中路28号',4,'SZN',1,'2011-12-26 00:00:00.000000','2026-04-08 21:49:32.226898','2026-04-08 21:49:32.226899','深圳北站是深圳最大的高铁站','深圳,北站,高铁',0);
INSERT INTO stations VALUES(9,'深圳站','深圳市罗湖区建设路1003号',4,'SZQ',1,'1990-12-22 00:00:00.000000','2026-04-08 21:49:32.226899','2026-04-08 21:49:32.226899','深圳站是深圳的主要火车站','深圳,站,火车站',0);
INSERT INTO stations VALUES(10,'杭州东站','杭州市上城区全福桥路2号',5,'HZH',1,'2013-07-01 00:00:00.000000','2026-04-08 21:49:32.226900','2026-04-08 21:49:32.226900','杭州东站是杭州最大的高铁站','杭州,东站,高铁',0);
INSERT INTO stations VALUES(11,'杭州站','杭州市上城区城站路1号',5,'HZQ',1,'1906-11-14 00:00:00.000000','2026-04-08 21:49:32.226901','2026-04-08 21:49:32.226901','杭州站是杭州的主要火车站','杭州,站,火车站',0);
CREATE TABLE cities (
	id INTEGER NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	code VARCHAR(20) NOT NULL, 
	province VARCHAR(100) NOT NULL, 
	level VARCHAR(50) NOT NULL, 
	population VARCHAR(50), 
	area VARCHAR(50), 
	zip_code VARCHAR(20), 
	description TEXT, 
	created_at DATETIME, 
	updated_at DATETIME, 
	is_active BOOLEAN, 
	PRIMARY KEY (id)
);
INSERT INTO cities VALUES(1,'北京','BJ','北京市','直辖市','2189万','16410平方公里','100000','中国首都，政治、文化中心','2026-04-08 21:12:14.235017','2026-04-08 21:12:14.235025',1);
INSERT INTO cities VALUES(2,'上海','SH','上海市','直辖市','2487万','6340平方公里','200000','中国经济、金融中心','2026-04-08 21:12:14.235026','2026-04-08 21:12:14.235027',1);
INSERT INTO cities VALUES(3,'广州','GZ','广东省','副省级城市','1867万','7434平方公里','510000','广东省省会，华南地区中心城市','2026-04-08 21:12:14.235027','2026-04-08 21:12:14.235028',1);
INSERT INTO cities VALUES(4,'深圳','SZ','广东省','副省级城市','1756万','1997平方公里','518000','经济特区，科技创新中心','2026-04-08 21:12:14.235028','2026-04-08 21:12:14.235028',1);
INSERT INTO cities VALUES(5,'杭州','HZ','浙江省','副省级城市','1220万','16853平方公里','310000','浙江省省会，电子商务中心','2026-04-08 21:12:14.235029','2026-04-08 21:12:14.235029',1);
INSERT INTO cities VALUES(6,'重庆','CQ','重庆市','直辖市','3000万','82000','400000','','2026-04-08 23:09:18.212728','2026-04-08 23:09:18.212738',1);
CREATE TABLE orders (
	id INTEGER NOT NULL, 
	order_no VARCHAR(64) NOT NULL, 
	train_num VARCHAR(32) NOT NULL, 
	train_date VARCHAR(32) NOT NULL, 
	from_station VARCHAR(64) NOT NULL, 
	to_station VARCHAR(64) NOT NULL, 
	seat_type VARCHAR(32) NOT NULL, 
	passenger_name VARCHAR(64) NOT NULL, 
	passenger_id_card VARCHAR(32) NOT NULL, 
	price FLOAT NOT NULL, 
	status VARCHAR(9) NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
CREATE TABLE passengers (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(64) NOT NULL, 
	id_card VARCHAR(32) NOT NULL, 
	id_card_type VARCHAR(13) NOT NULL, 
	type VARCHAR(7) NOT NULL, 
	phone VARCHAR(20), 
	email VARCHAR(128), 
	status VARCHAR(32) NOT NULL, 
	created_at VARCHAR(32) DEFAULT CURRENT_TIMESTAMP, 
	updated_at VARCHAR(32), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
CREATE INDEX ix_users_id ON users (id);
CREATE UNIQUE INDEX ix_users_email ON users (email);
CREATE UNIQUE INDEX ix_users_username ON users (username);
CREATE INDEX ix_stations_name ON stations (name);
CREATE INDEX ix_stations_code ON stations (code);
CREATE INDEX ix_stations_id ON stations (id);
CREATE INDEX ix_stations_city_id ON stations (city_id);
CREATE INDEX ix_cities_name ON cities (name);
CREATE UNIQUE INDEX ix_cities_code ON cities (code);
CREATE INDEX ix_cities_id ON cities (id);
CREATE INDEX ix_cities_province ON cities (province);
CREATE INDEX ix_cities_level ON cities (level);
CREATE INDEX ix_orders_id ON orders (id);
CREATE UNIQUE INDEX ix_orders_order_no ON orders (order_no);
CREATE INDEX ix_passengers_id ON passengers (id);
COMMIT;
