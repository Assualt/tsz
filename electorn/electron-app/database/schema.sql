-- 城市信息表 (cities)
-- 用于存储城市基本信息，与车站信息关联

CREATE TABLE IF NOT EXISTS cities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '城市ID，主键',
    name VARCHAR(100) NOT NULL COMMENT '城市名称，如：北京、上海',
    code VARCHAR(20) NOT NULL COMMENT '城市代码，如：BJ、SH',
    province VARCHAR(100) NOT NULL COMMENT '所属省份，如：北京市、广东省',
    level VARCHAR(50) NOT NULL COMMENT '城市等级，如：直辖市、副省级城市、地级市',
    population VARCHAR(50) COMMENT '人口数量，如：2189万',
    area VARCHAR(50) COMMENT '面积，如：16410平方公里',
    zip_code VARCHAR(20) COMMENT '邮政编码，如：100000',
    description TEXT COMMENT '城市描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 索引
    UNIQUE KEY uk_code (code) COMMENT '城市代码唯一索引',
    INDEX idx_name (name) COMMENT '城市名称索引',
    INDEX idx_province (province) COMMENT '省份索引',
    INDEX idx_level (level) COMMENT '城市等级索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='城市信息表';

-- 插入示例数据
INSERT INTO cities (name, code, province, level, population, area, zip_code, description) VALUES
('北京', 'BJ', '北京市', '直辖市', '2189万', '16410平方公里', '100000', '中华人民共和国首都'),
('上海', 'SH', '上海市', '直辖市', '2487万', '6340平方公里', '200000', '中国经济中心'),
('广州', 'GZ', '广东省', '副省级城市', '1867万', '7434平方公里', '510000', '广东省省会'),
('深圳', 'SZ', '广东省', '副省级城市', '1756万', '1997平方公里', '518000', '中国经济特区'),
('杭州', 'HZ', '浙江省', '副省级城市', '1220万', '16850平方公里', '310000', '浙江省省会'),
('成都', 'CD', '四川省', '副省级城市', '2093万', '14335平方公里', '610000', '四川省省会'),
('武汉', 'WH', '湖北省', '副省级城市', '1364万', '8569平方公里', '430000', '湖北省省会'),
('西安', 'XA', '陕西省', '副省级城市', '1295万', '10108平方公里', '710000', '陕西省省会'),
('南京', 'NJ', '江苏省', '副省级城市', '942万', '6587平方公里', '210000', '江苏省省会'),
('重庆', 'CQ', '重庆市', '直辖市', '3205万', '82403平方公里', '400000', '中国直辖市');


# CREATE TABLE IF NOT EXISTS cities (
#     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '城市ID，主键',
#     name VARCHAR(100) NOT NULL COMMENT '城市名称，如：北京、上海',
#     code VARCHAR(20) NOT NULL COMMENT '城市代码，如：BJ、SH',
#     province VARCHAR(100) NOT NULL COMMENT '所属省份，如：北京市、广东省',
#     level VARCHAR(50) NOT NULL COMMENT '城市等级，如：直辖市、副省级城市、地级市',
#     population VARCHAR(50) COMMENT '人口数量，如：2189万',
#     area VARCHAR(50) COMMENT '面积，如：16410平方公里',
#     zip_code VARCHAR(20) COMMENT '邮政编码，如：100000',
#     description TEXT COMMENT '城市描述',
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
#     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
#     -- 索引
#     UNIQUE KEY uk_code (code) COMMENT '城市代码唯一索引',
#     INDEX idx_name (name) COMMENT '城市名称索引',
#     INDEX idx_province (province) COMMENT '省份索引',
#     INDEX idx_level (level) COMMENT '城市等级索引'
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='城市信息表';