#!/usr/bin/env python3
"""
测试数据脚本 - 用于向数据库中插入城市测试数据
"""

from app.core.database import SessionLocal
from app.models.city import City


def add_test_cities():
    """添加测试城市数据"""
    db = SessionLocal()
    try:
        # 检查是否已有数据
        existing_cities = db.query(City).count()
        if existing_cities > 0:
            print(f"数据库中已有 {existing_cities} 个城市数据，跳过添加测试数据")
            return
        
        # 测试城市数据
        cities_data = [
            {
                "name": "北京",
                "code": "BJ",
                "province": "北京市",
                "level": "直辖市",
                "population": "2189万",
                "area": "16410平方公里",
                "zip_code": "100000",
                "description": "中国首都，政治、文化中心"
            },
            {
                "name": "上海",
                "code": "SH",
                "province": "上海市",
                "level": "直辖市",
                "population": "2487万",
                "area": "6340平方公里",
                "zip_code": "200000",
                "description": "中国经济、金融中心"
            },
            {
                "name": "广州",
                "code": "GZ",
                "province": "广东省",
                "level": "副省级城市",
                "population": "1867万",
                "area": "7434平方公里",
                "zip_code": "510000",
                "description": "广东省省会，华南地区中心城市"
            },
            {
                "name": "深圳",
                "code": "SZ",
                "province": "广东省",
                "level": "副省级城市",
                "population": "1756万",
                "area": "1997平方公里",
                "zip_code": "518000",
                "description": "经济特区，科技创新中心"
            },
            {
                "name": "杭州",
                "code": "HZ",
                "province": "浙江省",
                "level": "副省级城市",
                "population": "1220万",
                "area": "16853平方公里",
                "zip_code": "310000",
                "description": "浙江省省会，电子商务中心"
            }
        ]
        
        # 插入数据
        for city_data in cities_data:
            city = City(**city_data)
            db.add(city)
        
        db.commit()
        print(f"成功添加 {len(cities_data)} 个城市测试数据")
        
    except Exception as e:
        print(f"添加测试数据失败: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_test_cities()
