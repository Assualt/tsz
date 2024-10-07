import { Layout, Form, Checkbox, TimeRangePicker } from 'element-react'

const TicketFilter = ({ queryFilter, isLoading, onPickUpDate }: any) => {
  const onPickUp = (value: String) => {
    console.log(value)
    onPickUpDate(value)
  }

  const getNext15Days = () => {
    let dates = []
    let currentDate = new Date() // 获取当前时间
    for (let i = 0; i < 15; i++) {
      let date = new Date()
      date.setDate(currentDate.getDate() + i) // 获取当前日期的i天后日期
      dates.push(date.toISOString().slice(0, 10)) // 将日期转换为字符串并添加到数组中
    }

    return dates
  }

  const onChangeValue = (value: String) => {
    console.log(value)
  }

  return (
    <div className="ticket-filter">
      <div style={{ height: '5vh' }}>
        {getNext15Days().map((item) => {
          return (
            <div className="ticket-filter-item" onClick={onPickUp.bind(this, item)}>
              {item.slice(5)}
            </div>
          )
        })}
      </div>
      <Layout.Row gutter={30}>
        <Layout.Col span={17} offset={1}>
          <Form inline={true}>
            <Form.Item label="车次类型" style={{ fontWeight: 'bolder', fontSize: '1.2em' }}>
              <Checkbox.Group onChange={onChangeValue.bind(this)}>
                {queryFilter.trainType.map((item: any) => {
                  return <Checkbox label={item} disabled={isLoading} />
                })}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Layout.Col>

        <Layout.Col span={6}>
          <span>发车时间&nbsp;&nbsp;</span>
          <TimeRangePicker value={queryFilter.time} placeholder="出发时间" isDisabled={isLoading} />
        </Layout.Col>
      </Layout.Row>
      <Layout.Row gutter={30}>
        <Layout.Col span={17} offset={1}>
          <Form inline={true}>
            <Form.Item label="出发车站" style={{ fontWeight: 'bolder', fontSize: '1.2em' }}>
              <Checkbox.Group>
                {queryFilter.from.map((item: any) => {
                  return <Checkbox label={item} disabled={isLoading}/>
                })}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Layout.Col>
      </Layout.Row>
      <Layout.Row gutter={30}>
        <Layout.Col span={17} offset={1}>
          <Form inline={true}>
            <Form.Item label="到达车站" style={{ fontWeight: 'bolder', fontSize: '1.2em' }}>
              <Checkbox.Group>
                {queryFilter.to.map((item: any) => {
                  return <Checkbox label={item} disabled={isLoading}/>
                })}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Layout.Col>
      </Layout.Row>
      <Layout.Row gutter={30}>
        <Layout.Col span={17} offset={1}>
          <Form inline={true}>
            <Form.Item label="车次席别" style={{ fontWeight: 'bolder', fontSize: '1.2em' }}>
              <Checkbox.Group>
                {queryFilter.seatType.map((item) => {
                  return <Checkbox label={item} disabled={isLoading}/>
                })}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Layout.Col>
      </Layout.Row>
    </div> 
  )
}

export default TicketFilter
