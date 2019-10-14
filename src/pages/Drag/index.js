import React, {Component} from 'react';
import HTML5Backend from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd"
import {DragTable} from './DragTable';
let list = [
  {
    id: 1,
    name: '实例1',
    key: 1,
  },
  {
    id: 2,
    name: '实例2',
    key: 2,
  },
  {
    id: 3,
    name: '实例3',
    key: 3,
  }
]
class App extends Component {
  state = {};
  componentDidMount() {
    list.forEach((item,index) => {
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
    this.setState({data: list})

  }
  render() {
    return <DragTable list={this.state.data} moveRow={this.moveRow} arr={[]}/>
  }
}
export default DragDropContext(HTML5Backend)(App)
