import _ from "lodash"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import React, { Fragment } from "react"
import { Card, Button, Divider, Popconfirm, Icon, message } from "antd"
import StandardTable from "../StandardTable/StandardTable"
import SystemFormModal from "./SystemFormModal"
// import { Link } from "react-router-dom"
import { DragTable } from "../DragTable/DragTable"
import HTML5Backend from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd"
// import update from "immutability-helper"
import { transformStandradTime } from "../../utils/utils";
// import { model } from "../../model/model"

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')

interface SystemCardProps {
  loading: boolean
  data: any
  handleCreate: (data) => any
  handleUpdate: (data) => any
  handleDelete: (data) => any
  switchSystem: (sysId, productId) => any
  saveRankedSystem?: any
  products: any
}

@observer
class SystemCard extends React.Component<SystemCardProps, any> {
  constructor(props) {
    super(props)
  }

  editing = {
    type: 'create',
    data: {}
  }
  state = {
    selectedRows: [],
    editModalVisible: false,
    rankBtnStatus: true,
    data: []
  }

  addKey = data => {
    if (data.length) {
      data = _.cloneDeep(data)
      data.forEach((item, index) => {
        item.key = index
      })
    }
    data.forEach((item,index) => {
      item.list = [
          {
              deleted: false,
              id: item.id*10+1,
              key: item.id*10+1,
              orgId: 2,
              rank: 2,
              slug: "yi-yang-xin-tong",
              systemsName: "示例系统1",
              type: 1
          },
          {
              deleted: false,
              id: item.id*10+2,
              key: item.id*10+2,
              orgId: 2,
              rank: 2,
              slug: "yi-yang-xin-tong",
              systemsName: "示例系统2",
              type: 1
          },
          {
              deleted: false,
              id: item.id*10+3,
              key: item.id*10+3,
              orgId: 2,
              rank: 2,
              slug: "yi-yang-xin-tong",
              systemsName: "示例系统3",
              type: 1
          },
      ];
    })
    this.setState({ data: data })
  }
  handleModalVisible = (key?, visible?) => {
    this.setState({ [key]: !!visible })
  }
  // 新建
  handleAdd = () => {
    this.editing.type = 'create'
    this.editing.data = {}
    this.handleModalVisible('editModalVisible', true)
  }
  // 编辑
  handleEdit = data => {
    this.editing.type = 'update'
    this.editing.data = data
    this.handleModalVisible('editModalVisible', true)
  }
  // 更新信息
  handleInfoUpdate = data => {
    const { handleCreate, handleUpdate } = this.props
    if (data.systemsName !== '') {
      this.editing.type === 'create' ? handleCreate(data) : handleUpdate(data)
      this.handleModalVisible('editModalVisible', false)
      this.handleSelectRows([])
    } else {
      message.error('必须输入系统名')
    }
  }
  // select row
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    })
  }
  //
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj }
      newObj[key] = getValue(filtersArg[key])
      return newObj
    }, {})

    const params: any = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order.replace('end', '')}`
    }

    // this.handleCurListData(params)
  }

  // system rank
  moveRow = (dragIndex, hoverIndex,indexArr) => {
      if (indexArr && indexArr.length) {
          let targetGroup =  this.state.data;
          for(let i = 0;i<indexArr.length;i++) {
             let cur = indexArr[i]
              targetGroup = targetGroup[cur];
          }
          let targetSys = (targetGroup as any).list.splice(dragIndex, 1);
          (targetGroup as any).list.splice(hoverIndex, 0, targetSys[0]);
      } else {
          let targetGroup = this.state.data;
          let targetSys = (targetGroup as any).splice(dragIndex, 1);
          (targetGroup as any).splice(hoverIndex, 0, targetSys[0]);
      }

     this.setState({data: this.state.data});
  }
  systemSort = () => {
    let data = toJS(this.props.data)
    this.addKey(data)
    this.setState({ rankBtnStatus: false, selectedRows: [] })
  }
  saveRankedSystem = () => {
    const { saveRankedSystem } = this.props
    saveRankedSystem(this.state.data)
    this.cancelRankedSystem()
  }
  cancelRankedSystem = () => {
    this.setState({ rankBtnStatus: true })
  }

  render() {
    const { loading, data, handleDelete, switchSystem, products } = this.props
    const { selectedRows, rankBtnStatus } = this.state
    toJS(products)
    let tableData = _.cloneDeep(toJS(data))
    toJS(products).length && tableData.map(item => {
      let p = _.find(toJS(products), { id: item.type })
      item.deadline = p && p.deadline
      item.systemType = p && p.name
    })
    tableData.sort((a, b) => a.rank - b.rank)
    const columns = [
      {
        title: '编号',
        dataIndex: 'id'
      },
      {
        title: '系统名称',
        dataIndex: 'systemsName'
      },
      {
        title: '所属产品',
        dataIndex: 'type',
        render: (val, record) => ((_.find(products, { id: val }) || {}).name)
      },
      {
        title: '产品到期时间',
        dataIndex: 'deadline',
        render: (val, record) => transformStandradTime(val)
      },
      {
        title: '操作',
        width: '30%',
        render: (val, record) => (
          <Fragment>
            <a
              href="javascript:;"
              onClick={() => {
                this.handleEdit(record);
              }}
            >
              编辑系统名称
            </a>
            <Divider type="vertical" />
            {/* <Link
              to={{
                pathname: `${model.user.server_root}/system/user`,
                state: { orgId: record.orgId, sysId: record.id }
              }}
            >
              人员管理
            </Link> */}
            {/* <Divider type="vertical" /> */}
            <a
              href="javascript:;"
              onClick={() => {
                switchSystem(record.id, (_.find(products, { id: record.type }) || {}).name);
              }}
            >
              进入系统
            </a>
          </Fragment>
        )
      }
    ]

    return (
      <div className="user">
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListOperator">
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleAdd()}
              >
                新建系统
              </Button>
              {rankBtnStatus ? (
                <Button onClick={this.systemSort}>系统排序</Button>
              ) : (
                <Fragment>
                  <Button onClick={this.saveRankedSystem} type="primary">
                    保存
                  </Button>
                  <Button onClick={this.cancelRankedSystem}>取消</Button>
                  <span style={{ float: "right", fontSize: "12px" }}>
                    <Icon type="info-circle-o" style={{ marginRight: "4px", fontSize: "12px" }} />
                    上下拖动行数据进行排序
                  </span>
                </Fragment>
              )}
              {(selectedRows.length > 0 &&
                rankBtnStatus) ? (
                  <span>
                    <Popconfirm
                      title="删除系统将删除该系统下的所有数据，是否要删除？"
                      onConfirm={() => {
                        handleDelete(_.map(selectedRows, "id"));
                        this.handleSelectRows([]);
                      }}
                    >
                      <Button>批量删除</Button>
                    </Popconfirm>
                  </span>
                ): <Button disabled={true}>批量删除</Button>}
            </div>
            {rankBtnStatus ? (
              <StandardTable
                rowKey="id"
                selectedRows={selectedRows}
                loading={loading}
                data={_.uniqBy(tableData, 'id')}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            ) : (
              <DragTable list={this.state.data} moveRow={this.moveRow} arr={[]}/>
            )}
          </div>
        </Card>
        <SystemFormModal
          id="editModal"
          modalTitle="编辑系统名称"
          modalVisible={this.state.editModalVisible}
          handleInfoUpdate={this.handleInfoUpdate.bind(this)}
          handleModalVisible={this.handleModalVisible.bind(this)}
          data={this.editing.data}
          products={products}
          sysData={_.uniqBy(tableData, 'id')}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(SystemCard)
