<template>
  <div class="tab-box">
    <div class="tablist">
      <ul class="tabs-period">
        <li v-trigger='inx' v-for='(period,inx) in PeriodList.Content' :key='inx' :class='{active : TabTextIndex == inx}' @click='ChangeChartTab(period.Name,inx)'>{{period.Name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import "../assets/hqiconfont.css"

export default {
  name: 'TabList',
  data () {
    return {
      IsMinute: true,     //是否是分时线，默认是
      AddDocument: { Title: '文档', Content: [] },
      CloudDisk: { Title: '云盘', Content: [] },
      SateLite: { Title: '卫星', Content: [] },
      PeriodList: {
        Title: '分时', Content: [
          { Name: "分时", Value: 1 },
          // { Name: "五日", Value: 5 },
          { Name: "日线", Value: 0 },
          { Name: "周线", Value: 1 },
          { Name: "月线", Value: 2 },
          // { Name: "年线", Value: 3 },
          { Name: "1分钟", Value: 4 },
          { Name: "5分钟", Value: 5 },
          // { Name: "15分钟", Value: 6 },
          // { Name: "30分钟", Value: 7 },
          // {Name:"60分钟",Value:8}
        ]
      },
      RightIndex: { Title: '复权', Content: ['不复权', '前复权', '后复权'] },
      MainIndex: { Title: '指标', Content: ['MA', 'BOLL', 'BBI', 'MIKE', 'PBX', 'ENE'] },  //主图指标

      IsPeriod: false,  //周期
      IsLinetype: false,  // K线类型
      IsRight: false,   //复权
      TabTextIndex: 0,  //当前的导航栏点击位置，分时  日线 周线等
      CurrentTab: 99,
      KlineRightFlag: 1,
      KlineIndexFlag: 0,
    }
  },
  directives: {
    trigger: {
      inserted (el, binding, inx) {
        if (binding.value === 0) {
          el.click();
          setTimeout(function () {
            el.click();
            setTimeout(function () {
              el.click()
            }, 600)
          }, 500)
        }
      }
    }
  },
  created () {
    document.title = "行情页面";
  },

  methods: {
    ClickTab (index) {
      this.CurrentTab = index;
      switch (index) {
        case 0:
          this.IsRight = false;
          this.IsLinetype = false;
          this.IsPeriod = false;
          break;
        case 1:
          this.IsRight = false;
          this.IsLinetype = false;
          this.IsPeriod = false;
          break;
        case '周期':
          this.IsRight = false;
          this.IsLinetype = false;
          this.IsPeriod = !this.IsPeriod;
          break;
        case '复权':
          this.IsLinetype = false;
          this.IsPeriod = false;
          this.IsRight = !this.IsRight;
          break;
        case '指标':
          this.IsPeriod = false;
          this.IsRight = false;
          this.IsLinetype = !this.IsLinetype;
          break;
        case 5:
          this.IsRight = false;
          this.IsLinetype = false;
          this.IsPeriod = false;
          break;
      }
    },
    ChangeChartTab (name, index) {
      this.PeriodList.Title = name;
      if (this.PeriodList.Title == "分时" || this.PeriodList.Title == "五日") {
        this.IsMinute = true;
      } else {
        this.IsMinute = false;
      }
      this.IsPeriod = false;
      this.TabTextIndex = index;
      this.$emit('ChangeChartTab', name, index);  //再次触发
    },
    ChangeKlinRight (name, index) {
      // this.RightIndex.Title = name;
      this.IsRight = false;
      if (this.KlineRightFlag == index) return;
      this.KlineRightFlag = index;
      this.$emit('ChangeKlinRight', index);
    },
    ChangeKlinIndex (indexItem, flag) {  //修改k线指标
      this.KlineIndexFlag = flag;
      this.IsLinetype = false;
      this.$emit('ChangeKlinIndex', indexItem, flag);
    },
    GotoPlaying () {
      this.IsLinetype = false;
      this.$message("您没有获得使用权限，无法使用！");
    },
  },
}
</script>

<style lang="less" scoped>
body,
#app {
  height: 100%;
  width: 100%;
}
html,
body {
  font: 62.5% "PingFang-SC-Regular", "Microsoft Yahei";
}
.active {
  color: #ff4d00;
}
.liactive {
  background-color: #ececec;
  height: 34px;
  color: hsl(210, 74%, 49%);
}
.tab-box {
  .tablist {
    width: 90%;
    height: 60px;
    // border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    > ul {
      display: flex;
      width: 100%;
      height: 34px;
      // border-bottom: 1px solid #cccccc;
      > li {
        position: relative;
        flex: 1;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        text-align: center;
        font-weight: 600;
        color: #333333;
        // border-right: 1px solid #cccccc;
        // .tabs-period {
        //   position: absolute;
        //   top: 35px;
        //   z-index: 2;
        //   width: 7px;
        //   // background: #ffffff;
        //   box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.6);
        //   > li {
        //     display: block;
        //     line-height: 35px;
        //     font-size: 14px;
        //     // border-bottom:1px solid #ececec;
        //     color: #ffffff;
        //   }
        // }
        .hq-icon {
          font-size: 20px;
        }
      }
      > li:last-child {
        border-right: none;
      }
    }
  }
  .phoneRight {
    position: absolute;
    top: 35px;
    z-index: 2;
    margin-top: 0;
    width: 7px;
    height: auto;
    background: #ffffff;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.6);
    li {
      line-height: 37px;
      font-size: 14px;
      text-align: center;
      border-bottom: 1px solid #ececec;
    }
    li.active {
      color: #217cd9;
      background-color: #ffffff;
    }
    .phone-tilte {
      margin-top: 0 !important;
      line-height: 3px;
      background-color: #ececec;
    }
  }
  .indexWrap {
    width: 9px;
    li {
      padding-left: 08px;
      box-sizing: border-box;
      text-align: left;
    }
  }
}
</style>