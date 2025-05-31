import React from 'react'
import { Layout, Space, Table, TableProps, Button, Popover, message } from 'antd'
import { SearchResultField, TrainStation, SeatLeftTicketPrice } from '../Constant'
import dayjs from 'dayjs'
import { fetchStationByTrainNo, fetchPriceByTrainNo } from '@renderer/api/ticket'
import { useNavigate } from 'react-router-dom'

const Result = ({ isSearch, searchResult, searchParam }) => {
  const [popOverContent, setPopOverContent] = React.useState<JSX.Element>()
  const [expandPriceTblData, setExpandPriceTblData] = React.useState<SeatLeftTicketPrice[]>([])
  const [expandTrainKey, setExpandTrainKey] = React.useState<React.Key[]>([])
  const navigate = useNavigate()

  const popOverColumns = [
    {
      title: '站序',
      render: (_, _record: object, index: number): number => index + 1
    },
    {
      title: '站名',
      dataIndex: 'name'
    },
    {
      title: '到站时间',
      render: (_, record): string => record.arrivalTime.format('HH:mm:ss')
    },
    {
      title: '出发时间',
      render: (_, record): string => record.leaveTime.format('HH:mm:ss')
    },
    {
      title: '停留时间',
      render: (_, record): string => record.leaveTime.diff(record.arrivalTime, 'minute') + '分钟'
    }
  ]

  React.useEffect(() => {
    setPopOverContent(trainStationsWrapper([]))
  }, [])

  const showTrainStationsTitle = (record: SearchResultField): JSX.Element => {
    return (
      <h2>
        {record.trainNo} ## {record.station_from} - {record.station_to}
      </h2>
    )
  }

  const updatePopOverContent = (trainNo: string, key: React.Key, updateKey: boolean = false) => {
    fetchStationByTrainNo(trainNo)
      .then((res) => {
        let stations: TrainStation[] = []
        res.data.map((item, index) => {
          stations.push({
            key: index + 1,
            name: item.name,
            code: item.code,
            arrivalTime: dayjs(item.arrivalTime),
            leaveTime: dayjs(item.leaveTime)
          })
        })
        setPopOverContent(trainStationsWrapper(stations))
      })
      .catch((err) => {
        message.error(`请求${trainNo} 车站失败,请稍后再试 ${err}`)
      })

    if (updateKey) {
      setExpandTrainKey([key])
    }
  }

  const trainStationsWrapper = (record: TrainStation[]): JSX.Element => {
    return (
      <Table
        columns={popOverColumns}
        dataSource={record}
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
      render: (_, record): JSX.Element => {
        return (
          <Space direction="vertical" size={5}>
            <Popover
              placement="right"
              title={showTrainStationsTitle(record)}
              content={popOverContent}
              trigger="click"
            >
              <Button type="link" onClick={() => updatePopOverContent(record.trainNo, record.key)}>
                {record.trainNo}
              </Button>
            </Popover>
            <span>
              <strong className="train-fuxing">复</strong>
              <strong className="train-intelligence">智</strong>
              <strong className="train-slice">静</strong>
            </span>
          </Space>
        )
      },
      align: 'center',
      width: 100
    },
    {
      title: (
        <Space direction="vertical">
          <b>出发站</b>
          <b>到达站</b>
        </Space>
      ),
      render: (_, record): JSX.Element => {
        return (
          <Space direction="vertical" size={5}>
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
      },
      ellipsis: true,
      align: 'center',
      width: 100
    },
    {
      title: '到达时间',
      render: (_, record): JSX.Element => {
        return (
          <Space direction="vertical" size={10}>
            <strong>{record.begin_time.format('HH:mm')}</strong>
            <strong>{record.end_time.format('HH:mm')}</strong>
          </Space>
        )
      },
      align: 'center',
      width: 100
    },
    {
      title: '时长',
      render: (_, record): string =>
        `${record.end_time.diff(record.begin_time, 'hour')}:${record.end_time.diff(record.begin_time, 'minute') % 60}:00`,
      align: 'center',
      width: 100
    },
    {
      title: (
        <Space direction="vertical">
          <b>商务座</b>
          <b>特等座</b>
        </Space>
      ),
      render: (_, record) => showLeftNumber(record.seatInfo.business + record.seatInfo.special),
      align: 'center',
      width: 100
    },
    {
      title: '一等座',
      render: (_, record) => showLeftNumber(record.seatInfo.first),
      align: 'center',
      width: 100
    },
    {
      title: (
        <Space direction="vertical">
          <b>二等座</b>
          <b>二等包座</b>
        </Space>
      ),
      render: (_, record) => showLeftNumber(record.seatInfo.second),
      align: 'center',
      width: 100
    },
    {
      title: '动卧',
      render: (_, record) => showLeftNumber(record.seatInfo.lying),
      align: 'center',
      width: 100
    },
    {
      title: '高级软卧',
      render: (_, record) => showLeftNumber(record.seatInfo.super_soft_lying),
      align: 'center',
      width: 100
    },
    {
      title: (
        <Space direction="vertical">
          <b>软卧</b>
          <b>一等卧</b>
        </Space>
      ),
      render: (_, record) => showLeftNumber(record.seatInfo.soft_lying),
      align: 'center',
      width: 100
    },
    {
      title: (
        <Space direction="vertical">
          <b>硬卧</b>
          <b>二等卧</b>
        </Space>
      ),
      render: (_, record) => showLeftNumber(record.seatInfo.hard_lying),
      align: 'center',
      width: 100
    },
    {
      title: '软座',
      render: (_, record) => showLeftNumber(record.seatInfo.soft_seat),
      align: 'center',
      width: 100
    },
    {
      title: '硬座',
      render: (_, record) => showLeftNumber(record.seatInfo.hard_seat),
      align: 'center',
      width: 100
    },
    {
      title: '无座',
      render: (_, record) => showLeftNumber(record.seatInfo.no_seat),
      align: 'center',
      width: 100
    },
    {
      title: '其他',
      render: () => '...',
      align: 'center',
      width: 100
    },
    {
      title: '操作',
      render: (record): JSX.Element => {
        return (
          <Button
            type="link"
            // href={`/order?trainNo=${record.trainNo}&trainDate=${searchParam.date.format('YYYY_MM_DD')}`}
            onClick={() => { 
              navigate(`/order?trainNo=${record.trainNo}&trainDate=${searchParam.date.format('YYYY_MM_DD')}`)
              console.log(record.trainNo)
            }}
          >
            预定
          </Button>
        )
      },
      align: 'center',
      width: 100
    }
  ]

  const expandColumns: TableProps<SeatLeftTicketPrice>['columns'] = [
    {
      title: '车次',
      render: () => showPrice(undefined),
      align: 'center',
      key: 'train_number',
      width: 100
    },
    {
      title: '出发站',
      render: () => showPrice(undefined),
      ellipsis: true,
      align: 'center',
      width: 100
    },
    {
      title: '到达时间',
      render: () => showPrice(undefined),
      align: 'center',
      width: 100
    },
    {
      title: '时长',
      render: () => showPrice(undefined),
      colSpan: 0
    },
    {
      title: '商务座',
      render: (record) => showPrice(record.business),
      align: 'center',
      width: 100
    },
    {
      title: '一等座',
      render: (record) => showPrice(record.first),
      align: 'center',
      width: 100
    },
    {
      title: '二等座',
      render: (record) => showPrice(record.second),
      align: 'center',
      width: 100
    },
    {
      title: '动卧',
      render: (record) => showPrice(record.lying),
      align: 'center',
      width: 100
    },
    {
      title: '高级软卧',
      render: (record) => showPrice(record.super_soft_lying),
      align: 'center',
      width: 100
    },
    {
      title: '软卧',
      render: (record) => showPrice(record.soft_lying),
      align: 'center',
      width: 100
    },
    {
      title: '硬卧',
      render: (record) => showPrice(record.hard_lying),
      align: 'center',
      width: 100
    },
    {
      title: '软座',
      render: (record) => showPrice(record.soft_seat),
      align: 'center',
      width: 100
    },
    {
      title: '硬座',
      render: (record) => showPrice(record.hard_seat),
      align: 'center',
      width: 100
    },
    {
      title: '无座',
      render: (record) => showPrice(record.no_seat),
      align: 'center',
      width: 100
    },
    {
      title: '其他',
      render: () => showPrice(undefined),
      align: 'center',
      width: 100
    },
    {
      title: '操作',
      render: () => showPrice(undefined),
      align: 'center',
      width: 100
    }
  ]

  const showLeftNumber = (leftNumber: undefined | number): JSX.Element => {
    // 如果leftNumber为undefined，则返回一个空div
    if (leftNumber === undefined) {
      return <div style={{ color: 'gray', fontWeight: 'bold' }}>--</div>
    }
    // 如果leftNumber大于20，则返回一个绿色的div
    if (leftNumber > 20) {
      return <div style={{ color: 'green', fontWeight: 'bold' }}>有</div>
    } else if (leftNumber > 0) {
      // 如果leftNumber等于0，则返回一个黄色的div
      return <div style={{ color: 'orange', fontWeight: 'bold' }}>{leftNumber}</div>
    } else {
      return <div style={{ color: 'gray', fontWeight: 'bold' }}>无</div>
    }
  }

  const showPrice = (price: undefined | number) => {
    if (price === undefined) {
      return
    }
    return <div style={{ color: 'rgb(252, 131, 2)', fontWeight: 'bold' }}>￥{price}</div>
  }

  const expandedRowRender = (): JSX.Element => {
    return (
      <Table<SeatLeftTicketPrice>
        columns={expandColumns}
        dataSource={expandPriceTblData}
        pagination={false}
        showHeader={false}
      />
    )
  }

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
          onRow={(record) => ({
            onClick: (): void => {
              if (expandTrainKey[0] === record.key) {
                setExpandTrainKey([])
              } else {
                updatePopOverContent(record.trainNo, record.key, true)
              }
            }
          })}
          dataSource={searchResult}
          columns={searchResultColumns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          loading={isSearch}
          scroll={{ y: 500 }}
          style={{ maxHeight: '400px', overflowY: 'scroll', cursor: 'pointer' }}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
            onExpand(expanded, record) {
              if (!expanded) {
                return
              }
              fetchPriceByTrainNo(record.trainNo)
                .then((res) => {
                  console.log(res.data.price)
                  setExpandPriceTblData([res.data.price])
                })
                .catch((err) => {
                  message.error(`请求 ${record.trainNo}票价失败 ${err}`)
                })
            },
            expandedRowKeys: expandTrainKey,
            showExpandColumn: false
          }} 
        />
      </Space>
    </Layout>
  )
}

export default Result
