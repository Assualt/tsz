import React from 'react'
import { Layout, Space, Table, TableProps, Button, Popover } from 'antd'
import { SearchResultField } from '../Constant'

const showTrainStationsTitle = (record: SearchResultField) => {
  return (
    <h2>
      {record.trainNo} ## {record.station_from} - {record.station_to}
    </h2>
  )
}

const showTrainStations = (record: SearchResultField) => {
  const columns = [
    {
      title: '站序',
      render: (_, record, index) => index + 1
    },
    {
      title: '站名',
      dataIndex: 'name'
    },
    {
      title: '到站时间',
      render: (_, record) => record.arrivalTime.format('HH:mm:ss')
    },
    {
      title: '出发时间',
      render: (_, record) => record.leaveTime.format('HH:mm:ss')
    },
    {
      title: '停留时间',
      render: (_, record) => record.leaveTime.diff(record.arrivalTime, 'minute') + '分钟'
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={record.stations}
      pagination={false}
      style={{ width: '600px' }}
      scroll={{ x: 400, y: 300 }}
    />
  )
}

const searchResultColumns: TableProps<SearchResultField>['columns'] = [
  {
    title: '车次',
    dataIndex: 'trainNo',
    key: 'trainNo',
    render: (_, record) => {
      return (
        <Space direction="vertical" size={5} style={{ minWidth: '10vh' }}>
          <Popover
            placement="right"
            title={showTrainStationsTitle(record)}
            content={showTrainStations(record)}
          >
            <Button type="link">{record.trainNo}</Button>
          </Popover>
          <span>
            <strong className="train-fuxing">复</strong>
            <strong className="train-intelligence">智</strong>
            <strong className="train-slice">静</strong>
          </span>
        </Space>
      )
    }
  },
  {
    title: (
      <Space direction="vertical" style={{ minWidth: '20vh' }}>
        <b>出发站</b>
        <b>到达站</b>
      </Space>
    ),
    render: (_, record) => {
      return (
        <Space direction="vertical" size={5} style={{ minWidth: '20vh' }}>
          <span>
            <strong className={record.isStart ? 'train-start' : 'train-middle'}>
              {record.isStart ? '始' : '过'}
            </strong>
            {record.station_from}
          </span>
          <span>
            <strong className={record.isEnd ? 'train-end' : 'train-middle'}>
              {record.isEnd ? '终' : '过'}
            </strong>
            {record.station_to}
          </span>
        </Space>
      )
    }
  },
  {
    title: '到达时间',
    render: (_, record) => {
      return (
        <Space direction="vertical" size={10}>
          <strong>{record.begin_time.format('HH:mm')}</strong>
          <strong>{record.end_time.format('HH:mm')}</strong>
        </Space>
      )
    }
  },
  {
    title: '时长',
    render: (_, record) =>
      `${record.end_time.diff(record.begin_time, 'hour')}:${record.end_time.diff(record.begin_time, 'minute') % 60}:00`
  },
  {
    title: (
      <Space direction="vertical" style={{ minWidth: '20vh' }}>
        <b>商务座</b>
        <b>特等座</b>
      </Space>
    ),
    render: (_, record) => record.seatInfo.business + record.seatInfo.special
  },
  {
    title: '一等座',
    render: (_, record) => record.seatInfo.first
  },
  {
    title: (
      <Space direction="vertical" style={{ minWidth: '20vh' }}>
        <b>二等座</b>
        <b>二等包座</b>
      </Space>
    ),
    render: (_, record) => record.seatInfo.second
  },
  {
    title: '动卧',
    render: (_, record) => record.seatInfo.lying
  },
  {
    title: '高级软卧',
    render: (_, record) => record.seatInfo.super_soft_lying
  },
  {
    title: (
      <Space direction="vertical" style={{ minWidth: '20vh' }}>
        <b>软卧</b>
        <b>一等卧</b>
      </Space>
    ),
    render: (_, record) => record.seatInfo.soft_lying
  },
  {
    title: (
      <Space direction="vertical" style={{ minWidth: '20vh' }}>
        <b>硬卧</b>
        <b>二等卧</b>
      </Space>
    ),
    render: (_, record) => record.seatInfo.hard_lying
  },
  {
    title: '软座',
    render: (_, record) => record.seatInfo.soft_seat
  },
  {
    title: '硬座',
    render: (_, record) => record.seatInfo.hard_seat
  },
  {
    title: '无座',
    render: (_, record) => record.seatInfo.no_seat
  },
  {
    title: '其他',
    render: (_, record) => '...'
  },
  {
    title: '操作',
    render: (_, record) => {
      return <Button type="default">预定</Button>
    }
  }
]

const Result: React.FC = ({ isSearch, searchResult, searchParam }) => {
  return (
    <Layout
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '2vh'
      }}
    >
      <Space direction="vertical" size={20}>
        <h2>
          {searchParam.from} - {searchParam.to} ({searchParam.date.format('YYYY-MM-DD dddd')}） 共计
          {searchResult.length}个车次
        </h2>

        <Table<SearchResultField>
          dataSource={searchResult}
          columns={searchResultColumns}
          pagination={true}
          loading={isSearch}
          scroll={{ y: 500 }}
          style={{ maxheight: '400px', overflowY: 'scroll' }}
          expandable={{
            expandedRowRender: (record) => {
              return <tr>123</tr>
            },
            rowExpandable: (record) => record.priceInfo?.length > 0 // only expand the row
          }}
        />
      </Space>
    </Layout>
  )
}

export default Result
