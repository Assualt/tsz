#!/usr/bin/env python3
"""
测试数据脚本 - 用于向数据库中插入车站测试数据
"""

from app.core.database import SessionLocal
from app.models.stations import Station as StationModel
from app.models.city import City
from datetime import datetime


def add_test_stations():
    """添加测试车站数据"""
    db = SessionLocal()
    try:
        # 检查是否已有数据
        existing_stations = db.query(StationModel).count()
        if existing_stations > 0:
            print(f"数据库中已有 {existing_stations} 个车站数据，跳过添加测试数据")
            return
        
        # 获取城市数据
        cities = db.query(City).all()
        if not cities:
            print("数据库中没有城市数据，请先添加城市测试数据")
            return
        
        # 按城市分组的测试车站数据
        stations_data = {
            "北京": [
                {
                    "name": "北京南站",
                    "code": "BJP",
                    "address": "北京市丰台区车站路1号",
                    "level": 5,
                    "description": "北京南站是中国最大的高铁站之一",
                    "keyword": "北京,南站,高铁",
                    "open_date": datetime(2008, 8, 1)
                },
                {
                    "name": "北京站",
                    "code": "BJPZ",
                    "address": "北京市东城区毛家湾胡同13号",
                    "level": 5,
                    "description": "北京站是北京最古老的火车站之一",
                    "keyword": "北京,站,火车站",
                    "open_date": datetime(1959, 9, 14)
                },
                {
                    "name": "北京西站",
                    "code": "BJXZ",
                    "address": "北京市丰台区莲花池东路",
                    "level": 5,
                    "description": "北京西站是北京重要的铁路枢纽",
                    "keyword": "北京,西站,火车站",
                    "open_date": datetime(1996, 1, 21)
                }
            ],
            "上海": [
                {
                    "name": "上海虹桥站",
                    "code": "SHH",
                    "address": "上海市闵行区申贵路1500号",
                    "level": 5,
                    "description": "上海虹桥站是上海最大的高铁站",
                    "keyword": "上海,虹桥,高铁",
                    "open_date": datetime(2010, 7, 1)
                },
                {
                    "name": "上海站",
                    "code": "SHHZ",
                    "address": "上海市静安区秣陵路303号",
                    "level": 5,
                    "description": "上海站是上海的主要火车站之一",
                    "keyword": "上海,站,火车站",
                    "open_date": datetime(1908, 4, 1)
                }
            ],
            "广州": [
                {
                    "name": "广州南站",
                    "code": "GZP",
                    "address": "广州市番禺区石壁街道",
                    "level": 5,
                    "description": "广州南站是华南地区最大的高铁站",
                    "keyword": "广州,南站,高铁",
                    "open_date": datetime(2010, 12, 30)
                },
                {
                    "name": "广州站",
                    "code": "GZQ",
                    "address": "广州市越秀区环市西路159号",
                    "level": 5,
                    "description": "广州站是广州的主要火车站",
                    "keyword": "广州,站,火车站",
                    "open_date": datetime(1974, 4, 12)
                }
            ],
            "深圳": [
                {
                    "name": "深圳北站",
                    "code": "SZN",
                    "address": "深圳市龙华区致远中路28号",
                    "level": 5,
                    "description": "深圳北站是深圳最大的高铁站",
                    "keyword": "深圳,北站,高铁",
                    "open_date": datetime(2011, 12, 26)
                },
                {
                    "name": "深圳站",
                    "code": "SZQ",
                    "address": "深圳市罗湖区建设路1003号",
                    "level": 5,
                    "description": "深圳站是深圳的主要火车站",
                    "keyword": "深圳,站,火车站",
                    "open_date": datetime(1990, 12, 22)
                }
            ],
            "杭州": [
                {
                    "name": "杭州东站",
                    "code": "HZH",
                    "address": "杭州市上城区全福桥路2号",
                    "level": 5,
                    "description": "杭州东站是杭州最大的高铁站",
                    "keyword": "杭州,东站,高铁",
                    "open_date": datetime(2013, 7, 1)
                },
                {
                    "name": "杭州站",
                    "code": "HZQ",
                    "address": "杭州市上城区城站路1号",
                    "level": 5,
                    "description": "杭州站是杭州的主要火车站",
                    "keyword": "杭州,站,火车站",
                    "open_date": datetime(1906, 11, 14)
                }
            ]
        }
        
        # 插入数据
        added_count = 0
        for city in cities:
            if city.name in stations_data:
                for station_data in stations_data[city.name]:
                    station = StationModel(
                        name=station_data["name"],
                        code=station_data["code"],
                        city_id=city.id,
                        address=station_data["address"],
                        level=station_data["level"],
                        description=station_data["description"],
                        keyword=station_data["keyword"],
                        open_date=station_data["open_date"]
                    )
                    db.add(station)
                    added_count += 1
        
        db.commit()
        print(f"成功添加 {added_count} 个车站测试数据")
        
    except Exception as e:
        print(f"添加测试数据失败: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_test_stations()
