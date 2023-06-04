const mockObj = require('mockjs')
const random = mockObj.Random

const dataNum = 20
function getUserList(type, num) {
    let data = []

    const Mock = require('mockjs')

    for (var i = 0; i < num; ++i) {
        data.push({
            userID: 10000 + i,
            userName: random.cname(),
            userNickName: random.cname(),
            userPassword: random.cname(),
            userSex: random.boolean() ? '男' : '女',
            userTel: random.string(),
            userEmail: random.email(),
            userJoinDate: random.datetime('yyyy-MM-dd HH:mm:ss'),
            userOrgID: type == 1 ? "普通用户" : "vip用户",
            userLastLogin: random.datetime('yyyy-MM-dd HH:mm:ss'),
        })
    }

    return data;
}
module.exports = [
    {
        url: '/api/userList',
        type: 'get',
        response: (param) => {
            const type = param.query.type;
            return {
                code: 20000,
                data: getUserList(type, dataNum)
            }
        }
    }
]