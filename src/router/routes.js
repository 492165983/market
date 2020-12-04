
import { resolve } from 'promise-polyfill'
import HelloWorld from '../components/HelloWorld.vue'
// import Horizontal from '../pages/horizontalHq.vue'

const routes =[
  {
    path:'/',
    redirect:'/helloWorld',
  },
  {
    path:'/helloWorld',
    component:HelloWorld,
    name:'helloWorld',
  },
  // {
  //   path:'/horizontal',
  //   component:Horizontal,
  //   name:'horizontal'
  // },
  {
    path: '/horizontal',
    name: 'horizontal',
    component:resolve => require(['@/pages/horizontalHq'],resolve),
  },
  {
    path: '/horizontalMarketIndex',
    name: 'horizontalMarketIndex',
    component:resolve => require(['@/pages/horizontalMarketIndex'],resolve),
  },
  {
    path: '/marketIndex',
    name: 'marketIndex',
    component:resolve => require(['@/pages/marketIndex'],resolve),
  }
]


export default routes