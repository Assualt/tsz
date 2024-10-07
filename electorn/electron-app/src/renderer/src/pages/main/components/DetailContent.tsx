import { Table, Button, Dialog, Layout, Form, Loading } from 'element-react'
import { useState, useEffect, useRef } from 'react'

const GetTableData = (result: any, func: Function) => {
  return {
    columns: [
      {
        type: 'expand',
        expandPannel: function () {
          return (
            <Form labelPosition="left" inline={true}>
              <Form.Item label="商务座 特等座">
                <span>
                  <i className="el-icon-coin">123</i>
                </span>
              </Form.Item>
            </Form>
          )
        }
      },
      {
        label: '车次',
        prop: 'no',
        render: (row, column, index) => {
          return (
            <Button
              type="text"
              size="small"
              onClick={(e) => {
                func(row.no)
              }}
            >
              <span style={{ color: 'black', fontWeight: 'bolder' }}>{row.no}</span>
            </Button>
          )
        }
      },
      {
        label: '出发站 到达站',
        prop: 'station'
      },
      {
        label: '出发时间 到达时间',
        prop: 'time',
        render: (row, column, index) => {
          return (
            <span>
              {row.startTime} {row.endTime}
            </span>
          )
        }
      },
      {
        label: '历时',
        prop: 'cost'
      },
      {
        label: '商务座 特等座',
        prop: 'business_special'
      },
      {
        label: '优选一等座',
        prop: 'sfirst_class'
      },
      {
        label: '一等座',
        prop: 'first_class'
      },
      {
        label: '二等座 二等包座',
        prop: 'second_class'
      },
      {
        label: '高级软卧',
        prop: 'ssoft_lying'
      },
      {
        label: '软卧 动卧 一等卧',
        prop: 'soft_lying'
      },
      {
        label: '硬卧/二等卧',
        prop: 'hard_lying'
      },
      {
        label: '软座',
        prop: 'soft_seat'
      },
      {
        label: '硬座',
        prop: 'hard_seat'
      },
      {
        label: '无座',
        prop: 'no_seat'
      },
      {
        label: '其它',
        prop: 'other'
      },
      {
        label: '备注',
        prop: 'desc'
      },
      {
        label: '操作',
        prop: 'opeation',
        fixed: 'right',
        render: (row, params) => {
          return (
            <Button type="danger" size="small" disabled={!row.isActive}>
              预定
            </Button>
          )
        }
      }
    ],
    data: result.trainList
  }
}

const GetTrainType = (trainType) => {
  if (trainType === 'G') {
    return '高铁'
  } else if (trainType === 'D') {
    return '动车'
  } else if (trainType === 'Z') {
    return '直达'
  } else if (trainType === 'T') {
    return '特快'
  } else if (trainType === 'K') {
    return '快速'
  } else if (trainType == 'C') {
    return '城际'
  }

  return '普快'
}

const GetTrainDetail = (queryResult: any, trainNo: String) => {
  let trainDetail = {}
  for (let i = 0; i < queryResult.trainList.length; ++i) {
    if (queryResult.trainList[i].no !== trainNo) {
      continue
    }

    let train = queryResult.trainList[i]
    trainDetail = {
      title: '车次详情 ' + train.from + ' -> ' + train.to,
      no: train.no,
      start: train.from,
      end: train.to,
      type: GetTrainType(train.type),
      detail: '有空调',
      columns: [
        {
          label: '站序',
          prop: 'index'
        }
      ],
      data: []
    }

    for (let j = 0; j < train.trainDetails.length; ++j) {
      trainDetail.data.push({
        index: j + 1,
        name: train.trainDetails[j].name,
        start: j === 0 ? '--' : train.trainDetails[j].start,
        end: j === train.trainDetails.length - 1 ? '--' : train.trainDetails[j].end,
        stop: j === 0 ? '--' : train.trainDetails[j].stop
      })
    }
  }

  return trainDetail
}

const getTrainNoDetailMenuItem = () => {
  return [
    {
      label: '站序',
      prop: 'index'
    },
    {
      label: '站名',
      prop: 'name'
    },
    {
      label: '到站时间',
      prop: 'start'
    },
    {
      label: '出发时间',
      prop: 'end'
    },
    {
      label: '停留时间',
      prop: 'stop'
    }
  ]
}

const DetailContent = ({ isLoading, queryResult }) => {
  const getQueryFmtDate = () => {
    const date = new Date(queryResult.date)
    if (queryResult.date == null) {
      return '--- 年 -- 月 -- 日'
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  const [dialogVisible, changeVisible] = useState(false)
  const [trainDetail, setTrainDetail] = useState({})

  const showTrainDetail = (train: String) => {
    setTrainDetail(GetTrainDetail(queryResult, train))
    changeVisible(true)
  }

  let tblData = GetTableData(queryResult, showTrainDetail)
  useEffect(() => {
    tblData = GetTableData(queryResult, showTrainDetail)
  }, [queryResult])

  return (
    <Loading text="玩命加载中..." loading={isLoading}>
      <div className="detail-content">
        <div className="detail-content-header">
          <div className="detail-content-header-title">
            <span style={{ fontSize: '1.2em', fontWeight: 'bolder' }}>{queryResult.from}</span>
            <i
              className="el-icon-d-arrow-right"
              style={{ marginLeft: '2vh', marginRight: '2vh', fontSize: '0.5em' }}
            ></i>
            <span style={{ fontSize: '1.2em', fontWeight: 'bolder' }}>{queryResult.to}</span>
            <span style={{ fontSize: '0.8em', fontWeight: 'bolder', marginLeft: '2vh' }}>
              {getQueryFmtDate()}
            </span>
            <span style={{ fontSize: '0.6em', marginLeft: '2vh' }}>
              共&nbsp;{(Array.isArray(queryResult.trainList) && queryResult.size) || 0}&nbsp;个车次
            </span>
          </div>
        </div>
        <div className="detail-content-body">
          <Table
            style={{ width: '100%' }}
            columns={tblData.columns}
            data={tblData.data}
            border={true}
            stripe={true}
            height={400}
          />
        </div>
        <Dialog
          title={trainDetail.title}
          visible={dialogVisible}
          onCancel={() => {
            changeVisible(false)
          }}
          closeOnPressEscape={true}
        >
          <Dialog.Body>
            <Table
              style={{ width: '100%' }}
              columns={getTrainNoDetailMenuItem()}
              data={trainDetail.data}
              border={true}
              stripe={true}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Layout.Row type="flex" justify="space-between">
              <Layout.Col span={4}>
                <strong>{trainDetail.no}</strong>次
              </Layout.Col>
              <Layout.Col span={5}>
                <b>{trainDetail.start}</b> - {trainDetail.end}
              </Layout.Col>
              <Layout.Col span={6}>{trainDetail.type}</Layout.Col>
              <Layout.Col span={6}>{trainDetail.detail}</Layout.Col>
            </Layout.Row>
          </Dialog.Footer>
        </Dialog>
      </div>
    </Loading>
  )
}

export default DetailContent
