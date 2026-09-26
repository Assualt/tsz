package com.houxin.electron.demo.mapper.entity;

import lombok.Data;

@Data
public class UserReply {
    public String userName;
    public String cookie;
    public String replyContent;

    public UserReply(String userName, String cookie, String replyContent) {
        this.userName = userName;
        this.cookie = cookie;
        this.replyContent = replyContent;
    }
}
