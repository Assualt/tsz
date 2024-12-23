package com.houxin.electron.demo.mapper.model;

import java.util.Date;

public class User {
    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.id
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private Integer id;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.username
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private String username;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.password
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private String password;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.email
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private String email;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.phone
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private String phone;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.create_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private Date createTime;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.update_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private Date updateTime;

    /**
     *
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column s_user.user_type
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    private String userType;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.id
     *
     * @return the value of s_user.id
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public Integer getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.id
     *
     * @param id the value for s_user.id
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.username
     *
     * @return the value of s_user.username
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public String getUsername() {
        return username;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.username
     *
     * @param username the value for s_user.username
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.password
     *
     * @return the value of s_user.password
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public String getPassword() {
        return password;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.password
     *
     * @param password the value for s_user.password
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.email
     *
     * @return the value of s_user.email
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public String getEmail() {
        return email;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.email
     *
     * @param email the value for s_user.email
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.phone
     *
     * @return the value of s_user.phone
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public String getPhone() {
        return phone;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.phone
     *
     * @param phone the value for s_user.phone
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.create_time
     *
     * @return the value of s_user.create_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.create_time
     *
     * @param createTime the value for s_user.create_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.update_time
     *
     * @return the value of s_user.update_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.update_time
     *
     * @param updateTime the value for s_user.update_time
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column s_user.user_type
     *
     * @return the value of s_user.user_type
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public String getUserType() {
        return userType;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column s_user.user_type
     *
     * @param userType the value for s_user.user_type
     *
     * @mbg.generated Sun Nov 10 14:45:44 CST 2024
     */
    public void setUserType(String userType) {
        this.userType = userType == null ? null : userType.trim();
    }
}