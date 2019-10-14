import _ from "lodash";
import { Table } from "antd";
import React from "react";
import { DragSource, DropTarget } from "react-dnd";
// import {DragTable2} from './DragTable2';
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return "downward";
  } else if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return "upward";
  }
  return undefined;
}

interface BodyRowProps {
  isOver?: any;
  connectDragSource: any;
  connectDropTarget: any;
  rankBtnStatus?: boolean;
  moveRow: any;
  dragRow: any;
  clientOffset: any;
  sourceClientOffset: any;
  initialClientOffset: any;
  style: any;
  className: any;
  index: any;
}

class BodyRow extends React.Component<BodyRowProps, any> {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: "move" };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === "downward") {
        className += " drop-over-downward";
      }
      if (direction === "upward") {
        className += " drop-over-upward";
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

const DragableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource("row", rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

interface DragTableProps {
  list: any;
  moveRow: any;
  products?: any;
  moveRow2?: any;
  arr?: any;
}
export class DragTable extends React.Component<DragTableProps, any> {
  components = {
    body: {
      row: DragableBodyRow
    }
  };

  move = (dragIndex, hoverIndex) => {
    this.props.moveRow(dragIndex, hoverIndex,this.props.arr);
  };


  render() {
    // const { products } = this.props;
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
      console.log(this.props.arr);
      function CustomExpandIcon(props) {
        console.log(props);
         if(!props.record.list){
           return null
         }
          let text;
          if (props.expanded) {
              text = '&#8679; collapse';
          } else {
              text = '&#8681; expand';
          }
          return (
              <a
                  className="expand-row-icon"
                  onClick={e => props.onExpand(props.record, e)}
                  dangerouslySetInnerHTML={{ __html: text }}
                  style={{ color: 'blue', cursor: 'pointer' }}
              />
          );
      }

    return (
      <Table
        columns={columns}
        dataSource={this.props.list}
        components={this.components}
        pagination={false}
        onRow={(record, index) => ({
          index,
          moveRow: this.move
        })}
        expandedRowRender={expandedRowRender}
        expandIcon = {CustomExpandIcon}
      />
    );
  }
}
