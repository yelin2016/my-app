import React, {Component} from 'react';
import { DragSource, DropTarget } from "react-dnd";
import { DragableBodyRow } from './BodyRow';
import { Table} from 'antd';
export class DragTable extends Component{
  components = {
    body: {
      row: DragableBodyRow
    }
  };
  move = (dragIndex, hoverIndex) => {
    this.props.moveRow(dragIndex, hoverIndex,this.props.arr);
  };
  render(){
    const columns = [
      {
        title: "编号",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "系统名称",
        dataIndex: "systemsName",
        key: "systemsName"
      },
      // {
      //   title: '所属产品',
      //   dataIndex: 'type',
      //   render: (val, record) => ((_.find(products, { id: val }) || {}).name)
      // }
    ]
    const expandedRowRender = (group,groupIndex) => {
      if(group.list && group.list.length) {
        let arr = this.props.arr;
        let newArr = arr.slice(0);
        newArr.push(groupIndex);
        return <DragTable list={group.list} arr={newArr} moveRow={this.props.moveRow}/>
      }
      return null
    }
     return (     <Table
       columns={columns}
       dataSource={this.props.list}
       components={this.components}
       pagination={false}
       onRow={(record, index) => ({
         index,
         moveRow: this.move
       })}
       expandedRowRender={expandedRowRender}
     />)
  }
}
