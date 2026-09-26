from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

##
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
### 城市信息表

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True, index=True, comment='城市ID，主键')
    name = Column(String(100), index=True, nullable=False, comment='城市名称，如：北京、上海')
    code = Column(String(20), unique=True, index=True, nullable=False, comment='城市代码，如：BJ、SH')
    province = Column(String(100), index=True, nullable=False, comment='所属省份，如：北京市、广东省')
    level = Column(String(50), index=True, nullable=False, comment='城市等级，如：直辖市、副省级城市、地级市')
    population = Column(String(50), comment='人口数量，如：2189万')
    area = Column(String(50), comment='面积，如：16410平方公里')
    zip_code = Column(String(20), comment='邮政编码，如：100000')
    description = Column(Text, comment='城市描述')
    created_at = Column(DateTime, default=datetime.now, comment='创建时间')
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')
    is_active = Column(Boolean, default=True, comment='是否激活')