package com.houxin.electron.demo.controller;

import java.util.List;

import com.houxin.electron.demo.mapper.model.Station;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.houxin.electron.demo.common.Result;
import com.houxin.electron.demo.mapper.entity.Ticket;
import com.houxin.electron.demo.services.TicketService;

@RestController
@RequestMapping("/ticket")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/query")
    private Result<Ticket> queryTicket() {
        Ticket ticket = ticketService.queryTicket();
        return Result.success(ticket);
    }

    @GetMapping("/cities")
    private Result<List<Station>> queryStations() {
        List<Station> stations = ticketService.getStations();
        return Result.success(stations);
    }
}
