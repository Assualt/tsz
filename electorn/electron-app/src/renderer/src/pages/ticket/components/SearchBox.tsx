import {
  message,
  Select,
  Form,
  Layout,
  Button,
  FormInstance,
  DatePicker,
  DatePickerProps
} from 'antd'
import { SwapOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { SearchBoxField } from '../constants'
import { fetchTicketInfoNew } from '../../../api/ticket'

const onSwitchPlace = (values: FormInstance<SearchBoxField>): void => {
  // TODO: 交换出发地和目的地
  const from = values.getFieldValue('from')
  const to = values.getFieldValue('to')
  values.setFieldValue('from', to)
  values.setFieldValue('to', from)
}

const onDateChange: DatePickerProps<dayjs.Dayjs[]>['onChange'] = (date, dateString) => {
  console.log(date, dateString)
}

const onFinishFailed = (errorInfo): void => {
  console.log('Failed:', errorInfo)
}

const SearchBox = ({
  stations,
  isSearch,
  setIsSearch,
  setSearchResult,
  setSearchParam
}): JSX.Element => {
  const [form] = Form.useForm()

  const onFinish = (values: SearchBoxField): void => {
    if (!values.from || !values.to) {
      message.error('出发地和目的地不能为空', 3)
      return
    }

    if (values.from === values.to) {
      message.error('出发地和目的地不能相同', 3)
      return
    }

    setIsSearch(true)
    setSearchParam({
      from: values.from,
      to: values.to,
      date: values.date
    })

    setTimeout(() => {
      message.success('查询成功', 3)
      fetchTicketInfoNew(values.from, values.to, values.date.format('YYYY-MM-DD'))
        .then((res) => {
          console.log(res.data)
          setSearchResult(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
      setIsSearch(false)
    }, 3000)
  }

  return (
    <Layout
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px'
      }}
    >
      <Form
        form={form}
        layout="inline"
        style={{ width: '100%' }}
        name="searchForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={isSearch}
      >
        <Form.Item<SearchBoxField> label="出发地" name="from">
          <Select placeholder="请选择出发地" style={{ width: '30vh' }}>
            {Array.isArray(stations) &&
              stations?.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.label}>
                    {item.label}({item.code})
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>

        <Form.Item<SearchBoxField>>
          <Button
            type="link"
            icon={<SwapOutlined />}
            style={{ color: 'black' }}
            onClick={() => onSwitchPlace(form)}
          />
        </Form.Item>

        <Form.Item<SearchBoxField> label="目的地" name="to">
          <Select placeholder="请选择目的地" style={{ width: '30vh' }}>
            {Array.isArray(stations) &&
              stations.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.label}>
                    {item.label}({item.code})
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>

        <Form.Item<SearchBoxField>
          label="出发日期"
          name="date"
          rules={[{ required: true, message: '请选择出发日期' }]}
        >
          <DatePicker
            onChange={onDateChange}
            minDate={dayjs()}
            maxDate={dayjs().add(15, 'day')}
            placeholder="请选择出发日期"
            lang="zh-CN"
            style={{ marginLeft: '1vh', width: '30vh' }}
            defaultPickerValue={dayjs()}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default SearchBox
