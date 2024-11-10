package com.houxin.electron.demo.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Result<T> {

    public static <T> Result<T> success(T data) {
        return new Result<T>(200, "success", data);
    }

    public static <T> Result<T> message(int error, String message, T data) {
        return new Result<T>(error, message, data);
    }

    public static <T> Result<T> error(String message, T data) {
        return new Result<T>(500, message, data);
    }

    public static <T> Result<T> error(String message, int code, T data) {
        return new Result<T>(code, message, data);
    }

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    private T data;

    private String message;

    private int code;

}
