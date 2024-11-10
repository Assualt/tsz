package com.houxin.electron.demo.mapper.dao;

import com.houxin.electron.demo.common.MyBatisUtils;
import com.houxin.electron.demo.mapper.model.Station;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.event.annotation.BeforeTestClass;

class StationMapperTest {

    static SqlSessionFactory factory;

    static {
        factory = MyBatisUtils.getSqlSessionFactory();
    }

    /**
     * 根据条件查询
     * */
    @Test
    public void selectByExample() {
        SqlSession session = factory.openSession();
        StationMapper mapper = session.getMapper(StationMapper.class);
    }

    @Test
    public void selectByPrimaryKey() {
        SqlSession session = factory.openSession();
        StationMapper mapper = session.getMapper(StationMapper.class);
        Integer id = 1;
        Station station = mapper.selectByPrimaryKey(id);
        System.out.println("station = " + station);
    }
}