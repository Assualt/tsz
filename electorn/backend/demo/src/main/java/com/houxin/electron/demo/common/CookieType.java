package com.houxin.electron.demo.common;

public enum CookieType {
    USER_TOKEN("@@user_token"),
    USER_ONLINE("@@user_online"),
    ;

    CookieType(String cookieName) {
        this.cookieName = cookieName;
    }

    public String cookieName;
}
