package com.houxin.electron.demo.services;
import com.houxin.electron.demo.mapper.model.Station;
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
        return List.of();
    }
}
