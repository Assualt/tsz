import { Form, Select, DatePicker, Button, Message } from 'element-react'
import { fetchTicketInfo } from '@renderer/api/ticket'
import { SearchInfo } from '../constant'
import { useState } from 'react'

const SearchBox = (cities, isLoading, onChangeLoading, onHandleQuery): JSX.Element => {
  const [searchInfo, setSearchInfo] = useState<SearchInfo>({
    from: '',
    to: '',
    startTime: new Date()
  })
  const onSearch = (): void => {
    onChangeLoading(true)
    setTimeout(() => {
      // TODO: 调用接口获取数据
      console.log(searchInfo)
      fetchTicketInfo(searchInfo.from, searchInfo.to, searchInfo.startTime)
        .then((res) => {
          console.log(res.data)
          const str = `一共检索到${res.data.size}条数据`
          Message.success(str)
          onHandleQuery(res.data)
        })
        .catch((err) => {
          Message.error('检索失败' + err)
        })
      onChangeLoading(false)
    }, 3000)
  }

  return (
    <div className="grid-content bg-purple-light search-box">
      <Form inline={true}>
        <Form.Item label="出发地" required={true}>
          <Select value={searchInfo.from} placeholder="请选择" disabled={isLoading}>
            {cities &&
              cities.map((item) => {
                return (
                  <Select.Option key={item.value} label={item.label} value={item.code}>
                    <span
                      style={{
                        float: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.value}
                    </span>
                    <span style={{ float: 'right', color: '#8492a6', fontSize: 13 }}>
                      {item.code}
                    </span>
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="text" size="large">
            <i className="el-icon-d-arrow-right"></i>
          </Button>
        </Form.Item>
        <Form.Item label="目的地" required={true}>
          <Select value={searchInfo.to} placeholder="目的地" disabled={isLoading}>
            {Array.isArray(cities) &&
              cities.map((item) => {
                return (
                  <Select.Option key={item.value} label={item.label} value={item.value}>
                    <span
                      style={{
                        float: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.value}
                    </span>
                    <span style={{ float: 'right', color: '#8492a6', fontSize: 13 }}>
                      {item.code}
                    </span>
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item label="出发日期" required={true}>
          <DatePicker
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            disabledDate={(time) => time.getTime() < Date.now() - 8.64e7}
            value={searchInfo.startTime}
            isDisabled={isLoading}
          ></DatePicker>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" onClick={onSearch} disabled={isLoading}>
            搜索
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SearchBox
