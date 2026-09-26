from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

##
# CREATE TABLE IF NOT EXISTS stations (
#     id INT AUTO_INCREMENT PRIMARY KEY COMMENT '车站ID，主键',
#     name VARCHAR(100) NOT NULL COMMENT '车站名称，如：北京南站、上海虹桥站',
#     code VARCHAR(20) NOT NULL COMMENT '车站代码，如：BJP、SHH',
#     city_id INT NOT NULL COMMENT '所属城市ID，外键关联cities表',
#     address VARCHAR(255) NOT NULL COMMENT '车站地址',
#     level INT DEFAULT 0 COMMENT '车站等级',
#     description TEXT COMMENT '车站描述',
#     keyword VARCHAR(255) COMMENT '关键词',
#     is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
#     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
#     
#     -- 索引
#     UNIQUE KEY uk_code (code) COMMENT '车站代码唯一索引',
#     INDEX idx_name (name) COMMENT '车站名称索引',
#     INDEX idx_city_id (city_id) COMMENT '城市ID索引',
#     INDEX idx_level (level) COMMENT '车站等级索引',
#     
#     -- 外键
#     FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE ON UPDATE CASCADE
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车站信息表';
### 车站信息表

class Station(Base):
    __tablename__ = "stations"
    id = Column(Integer, primary_key=True, index=True, comment='车站ID，主键')
    name = Column(String(100), index=True, nullable=False, comment='车站名称，如：北京南站、上海虹桥站')
    code = Column(String(20), unique=True, index=True, nullable=False, comment='车站代码，如：BJP、SHH')
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE", onupdate="CASCADE"), index=True, nullable=False, comment='所属城市ID，外键关联cities表')
    address = Column(String(255), nullable=False, comment='车站地址')
    level = Column(Integer, default=0, comment='车站等级')
    description = Column(Text, comment='车站描述')
    keyword = Column(String(255), comment='关键词')
    open_date = Column(DateTime, comment='开门时间')
    is_active = Column(Boolean, default=True, comment='是否激活')
    created_at = Column(DateTime, default=datetime.now, comment='创建时间')
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')
    
    # 关系
    city = relationship("City", backref="stations")
