package com.houxin.electron.demo.mapper.dao;

import com.houxin.electron.demo.mapper.model.Station;
import com.houxin.electron.demo.mapper.model.StationExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface StationMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    long countByExample(StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int deleteByExample(StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int deleteByPrimaryKey(Integer stationId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int insert(Station record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int insertSelective(Station record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    List<Station> selectByExampleWithBLOBs(StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    List<Station> selectByExample(StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    Station selectByPrimaryKey(Integer stationId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByExampleSelective(@Param("record") Station record, @Param("example") StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByExampleWithBLOBs(@Param("record") Station record, @Param("example") StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByExample(@Param("record") Station record, @Param("example") StationExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByPrimaryKeySelective(Station record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByPrimaryKeyWithBLOBs(Station record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table s_station
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    int updateByPrimaryKey(Station record);
}