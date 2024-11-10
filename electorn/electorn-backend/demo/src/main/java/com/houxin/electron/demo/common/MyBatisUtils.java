package com.houxin.electron.demo.common;

import lombok.Getter;
import org.apache.commons.codec.Resources;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.io.InputStream;

public class MyBatisUtils {
    @Getter
    private static SqlSessionFactory sqlSessionFactory = null;

    static {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getInputStream(resource);
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    }

    public static <T> T getMapper(Class<T> clazz) {
        return sqlSessionFactory.openSession().getMapper(clazz);
    }
}
