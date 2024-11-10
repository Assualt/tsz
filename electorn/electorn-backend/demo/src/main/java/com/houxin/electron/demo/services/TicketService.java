package com.houxin.electron.demo.services;
import com.houxin.electron.demo.common.MyBatisUtils;
import com.houxin.electron.demo.mapper.dao.StationMapper;
import com.houxin.electron.demo.mapper.model.Station;
import com.houxin.electron.demo.mapper.model.StationExample;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Service;
import com.houxin.electron.demo.mapper.entity.Ticket;
import com.houxin.electron.demo.services.impl.TicketQueryImpl;

import java.util.List;

@Service
public class TicketService implements TicketQueryImpl {

    @Override
    public Ticket queryTicket() {
        return Ticket.mockTicket();
    }

    public List<Station> getStations() {
        StationMapper stationMapper = MyBatisUtils.getMapper(StationMapper.class);
        return stationMapper.selectByExample(new StationExample());
    }
}
