package com.houxin.electron.demo.controller;

import com.houxin.electron.demo.common.CookieMgr;
import com.houxin.electron.demo.common.CookieType;
import com.houxin.electron.demo.mapper.entity.UserReply;
import com.houxin.electron.demo.mapper.model.User;
import com.houxin.electron.demo.services.UserService;
import org.springframework.web.bind.annotation.*;

import com.houxin.electron.demo.common.Result;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/hello")
    public Result<String> hello() {
        return Result.success("hello");
    }

    @PostMapping("/login")
    public Result<UserReply> login(@RequestBody Map<String, String> params) {
        String userName = params.get("username");
        String password = params.get("password");
        if (userName == null || password == null) {
            return Result.success(new UserReply(userName, null, "用户名或密码不能为空"));
        }

        User user = userService.getUserByName(userName);
        if (user == null) {
            return Result.success(new UserReply(userName, null, "用户不存在"));
        }

        if (!password.equals(user.getPassword())) {
            return Result.error("用户名或密码错误", 401, null);
        }

        if (CookieMgr.isCookieExist(CookieType.USER_ONLINE, userName)) {
            return Result.success(new UserReply(userName, CookieMgr.getCookie(userName), "用户已登录"));
        }

        log.info("用户登录，用户名：{} password:{}", userName, password);;

        String cookie = CookieMgr.applyCookie(CookieType.USER_TOKEN, userName);
        return Result.success(new UserReply(userName, cookie, "用户登录成功"));
    }

    @PostMapping("/logout")
    public Result<String> logout(@RequestBody Map<String, String> params) {
        String userName = params.get("username");
        if (userName == null) {
            return Result.error("用户名不能为空", 200, null);
        }

        // check user is in redis
        if (!CookieMgr.isCookieExist(CookieType.USER_ONLINE, userName)) {
            return Result.error("用户未登录", 200, null);
        }

        CookieMgr.removeCookie(CookieType.USER_ONLINE, userName);
        return Result.success("用户登出成功");
    }
}
