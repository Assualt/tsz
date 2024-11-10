package com.houxin.electron.demo.mapper.entity;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;

@Getter
enum SeatType {
    business(1, "商务座"),
    speical(2, "特等座"),
    first(3, "一等座"),
    second(4, "二等座"),
    lying(5, "硬卧"),
    super_soft_lying(6, "软卧"),
    soft_lying(7, "软卧"),
    hard_lying(8, "硬卧"),
    hard_seat(9, "硬座"),
    soft_seat(10, "软座"),
    no_seat(11, "无座");

    SeatType(int code, String name) {
        this.code = code;
        this.name = name;
    }

    private int code;
    private String name;
};

@Getter
@Setter
class PriceInfo {
    @JsonProperty("seatType")
    private String seatType;

    @JsonProperty("price")
    private double price;

    public PriceInfo(String seatType, double price) {
        this.seatType = seatType;
        this.price = price;
    }
};

@Getter
@Setter
class SeatInfo {
    private SeatType type;
    private int count;
    private double price;

    public SeatInfo(SeatType type, int count, double price) {
        this.type = type;
        this.count = count;
        this.price = price;
    }
};

@Getter
@Setter
class TrainStation {
    @JsonProperty("code")
    private String code;

    @JsonProperty("name")
    private String stationName;

    @JsonProperty("arrivalTime")
    private Date arrivalTime;

    @JsonProperty("leaveTime")
    private Date departureTime;

    public TrainStation(String code, String stationName, Date arrivalTime, Date departureTime) {
        this.code = code;
        this.stationName = stationName;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
    }
};

@Getter
@Setter
public class Ticket {
    private String trainNo;

    @JsonProperty("station_from")
    private String stationFrom;

    @JsonProperty("station_to")
    private String stationTo;

    @JsonProperty("start_time")
    private Date startTime;

    @JsonProperty("end_time")
    private Date endTime;

    @JsonProperty("seatInfo")
    private Map<String, Integer> seatInfo;

    @JsonProperty("isStart")
    private boolean isStart; // 是否出发

    @JsonProperty("isEnd")
    private boolean isEnd; // 是否到达

    @JsonProperty("trainList")
    private ArrayList<TrainStation> trainList; // 车站列表

    @JsonProperty("priceInfo")
    private ArrayList<PriceInfo> priceInfo;

    public Ticket() {
    }

    public static Ticket mockTicket() {
        Ticket ticket = new Ticket();

        ticket.setTrainNo("G1234");
        ticket.setStationFrom("北京");
        ticket.setStationTo("上海");
        ticket.setStartTime(new Date());
        ticket.setEndTime(new Date());

        Map<String, Integer> seatInfos = new HashMap<String, Integer>();
        seatInfos.put(SeatType.business.name(), 10);
        seatInfos.put(SeatType.speical.name(), 10);
        seatInfos.put(SeatType.first.name(), 10);
        seatInfos.put(SeatType.second.name(), 10);
        seatInfos.put(SeatType.lying.name(), 10);
        seatInfos.put(SeatType.super_soft_lying.name(), 10);
        seatInfos.put(SeatType.soft_lying.name(), 10);
        seatInfos.put(SeatType.hard_lying.name(), 10);
        seatInfos.put(SeatType.hard_seat.name(), 10);
        seatInfos.put(SeatType.soft_seat.name(), 10);
        seatInfos.put(SeatType.no_seat.name(), 10);

        ticket.setSeatInfo(seatInfos);
        ticket.setEnd(false);
        ticket.setStart(false);

        ArrayList<TrainStation> trainList = new ArrayList<>();
        trainList.add(new TrainStation("BJN", "北京", new Date(), new Date()));
        trainList.add(new TrainStation("TJN","天津", new Date(), new Date()));

        ticket.setTrainList(trainList);

        ArrayList<PriceInfo> priceInfo = new ArrayList<>();
        priceInfo.add(new PriceInfo(SeatType.business.name(), 1000.0));
        priceInfo.add(new PriceInfo(SeatType.business.name(), 1000.0));
        ticket.setPriceInfo(priceInfo);

        return ticket;
    }
};
