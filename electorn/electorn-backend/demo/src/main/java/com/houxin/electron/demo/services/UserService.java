package com.houxin.electron.demo.services;
import java.util.List;
import com.houxin.electron.demo.common.MyBatisUtils;
import com.houxin.electron.demo.mapper.dao.UserMapper;
import com.houxin.electron.demo.mapper.model.User;
import com.houxin.electron.demo.mapper.model.UserExample;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User getUserByName(String userName){
        // TODO: 根据用户名查询用户信息
        UserMapper userMapper = MyBatisUtils.getMapper(UserMapper.class);
        UserExample example = new UserExample();
        example.createCriteria().andUsernameEqualTo(userName);
        List<User> users = userMapper.selectByExample(example);
        if (users.size() != 1) {
            return null;
        }

        return users.get(0);
    }
}
