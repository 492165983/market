<!--横屏页面-->
<template>

  <div>
    <div class="container">
      <div class="symbolInfo" style="display:none">
        <div class="symbolContent">
          <div class="symbol_left">
            <div class="symbol_left_Kline" v-show='Kline.IsShow'>
              <div class="nameCss-kline">{{StockData.Name.Text}}</div>
              <div class="symbolCss-kline">{{Symbol}}</div>
            </div>
            <div class="symbol_left_1" v-show='Minute.IsShow'>
              <div class="symbolCss">{{Symbol}}</div>
              <div class="nameCss">{{StockData.Name.Text}}</div>
            </div>
            <div v-show='Minute.IsShow' class="symbol_left_2" :class="MinuteTooltip.Data.Increase.Color">
              {{MinuteTooltip.Data.AvPrice.Text}}
            </div>
          </div>
          <div class="symbol_right" v-show='Kline.IsShow'>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">低</span> <span :class="Tooltip.Data.Low.Color">{{Tooltip.Data.Low.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">高</span> <span :class="Tooltip.Data.High.Color">{{Tooltip.Data.High.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">收</span> <span>{{Tooltip.Data.Close.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">开</span> <span :class="Tooltip.Data.Open.Color">{{Tooltip.Data.Open.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1 symbol_right_3">
              <div class="topCss1">
                <span class="titleCss">成交额</span> <span>{{Tooltip.Data.Amount.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">成交量</span> <span>{{Tooltip.Data.Vol.Text}}</span>
              </div>
            </div>
          </div>
          <div class="symbol_right symbol_right_minute" v-show='Minute.IsShow'>
            <div class="symbol_right_1" style="height:24%;">
              <div class="topCss1">
                <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Increase.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Risefall.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">低</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Low.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">高</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.High.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">收</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Close.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">开</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Open.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1 symbol_right_3">
              <div class="topCss1">
                <span class="titleCss">成交额</span> <span>{{MinuteTooltip.Data.Amount.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">成交量</span> <span>{{MinuteTooltip.Data.Vol.Text}}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- k线板块 -->
      <div id="minuteChart" style="margin-left:25px;" ref="minute" v-show='Minute.IsShow'></div>
      <div id="kline" style="margin-left:30px;" ref="kline" v-show='Kline.IsShow'></div>
      <!--周期板块 -->
      <div class="topSwiper">
        <div v-trigger class="oneItem" :class='{activeTopSwiper: TabTextIndex == index}' v-for="(item,index) in PeriodList" :key="index" @click='ChangeChartTab(item.Name,index)'>
          <span>{{item.Name}}</span>
        </div>
        <div class="closeCss" @click='GoBack'>
          <!-- <span style="font-size:22px;" class="hq_iconfont icon-suoxiao"></span> -->
        </div>
      </div>
      <!-- k线图指标 -->
      <div class="indexWrap" ref='divindex' v-show="Index.IsShow">
        <span :key="index" v-for='(item,index) in Index.Menu' :class='{active : TabKlineIndex && current === index}' @click='ChangeIndex(item);change(index)' class="indexItem">
          {{item.Name}}</span>
      </div>
    </div>
  </div>

</template>

<script>
import Tools from "../services/tools"
import $ from 'jquery'
import "../assets/hqiconfont.css";
import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
var JSCommon = HQChart.Chart;
var JSCommonStock = HQChart.Stock;
// var myProdCode = window.myProdCode  //竖屏传过来的股票代码参数
var url = window.location.href; //获取地址栏中的url
var cs = url.split('?prodCode=')[1]; //获取url 中 "?" 之后的参数字符串
console.log(cs);
window.myProdCode = {
  prodCode: cs
}


function DefaultData () { }
//数据默认显示值
DefaultData.GetStockData = function () {
  const data =
  {
    Name: { Text: '' },
    Price: { Text: '', Color: 'PriceNull' },
    RiseFallPrice: { Text: '', Color: 'PriceNull' },
    Increase: { Text: '', Color: 'PriceNull' },
    High: { Text: '', Color: 'PriceNull' },
    Low: { Text: '', Color: 'PriceNull' },
    Open: { Text: '', Color: 'PriceNull' },
    MaxPrice: { Text: '', Color: 'PriceNull' },
    MinPrice: { Text: '', Color: 'PriceNull' },
    YClose: { Text: '' },

    Excahngerate: { Text: '', Color: 'PriceNull' },
    Amount: { Text: '' }, Vol: { Text: '' },
    Pe: { Text: '' }, Roe: { Text: '' },
    MarketV: { Text: '' }, FlowMarketV: { Text: '' },
    Eps: { Text: '' }, ScrollEPS: { Text: '' },
    Pb: { Text: '' }, Amplitude: { Text: '' },
    BookRate: { Text: '' }, BookDiffer: { Text: '' },
    Volratio: { Text: '' }, CapitalTatol: { Text: '' },
    CapitalA: { Text: '' },
    //指数才有
    Down: { Text: '' }, //上涨
    Up: { Text: '' },   //下跌
    Unchanged: { Text: '' },   //平盘
    Stop: { Text: '' },         //停牌

    HK: { Symbol: "", Name: "" },
    IsMargin: false,     //融资融券
    IsSHHK: false,       //沪港通
    IsHK: false,         //港股

    SellerFive: [],
    BuyerFive: [],
    Dealer: []
  };

  return data;
}
// 分钟走势图
DefaultData.GetMinuteOption = function (symbol) {
  let data = {
    Type: '分钟走势图横屏', //历史分钟走势图
    Symbol: symbol,
    IsAutoUpate: true, //是自动更新数据

    IsShowRightMenu: false, //右键菜单
    IsShowCorssCursorInfo: false, //是否显示十字光标的刻度信息
    DayCount: 1,
    CorssCursorTouchEnd: true,       //手指离开屏幕 隐藏十字光标
    CorssCursorInfo: { Left: 2, Right: 2, Bottom: 1, IsShowCorss: true },  //十字光标刻度设置

    Border: //边框
    {
      Left: 20, //左边间距
      Right: 1, //右边间距
      Top: 1,
      Bottom: 1
    },

    KLineTitle: //标题设置
    {
      IsShowName: false, //不显示股票名称
      IsShowSettingInfo: false, //不显示周期/复权
    },

    Frame: //子框架设置,刻度小数位数设置
      [
        { SplitCount: 5, StringFormat: 0 },
        { SplitCount: 3, StringFormat: 0 }
      ],
    ExtendChart:    //扩展图形
      [
        { Name: 'MinuteTooltip' }  //手机端tooltip
      ],
  };
  return data;
}
// k线走势图
DefaultData.GetKlineOption = function (symbol) {
  let data = {
    Type: '历史K线图横屏',
    Windows: [
      { Index: "均线", Modify: false, Change: false, API: { Name: '买卖点指标', Script: null, Args: null, Url: 'http://127.0.0.1:18080/api/jsindex' } },
      { Index: "VOL", Modify: false, Change: false, IsDrawTitleBG: false },
      { Index: "MACD", Modify: false, Change: false, IsDrawTitleBG: false },
    ], //窗口指标
    Symbol: symbol,
    IsAutoUpate: true, //是自动更新数据
    CorssCursorTouchEnd: true,       //手指离开屏幕 隐藏十字光标
    IsShowRightMenu: false, //右键菜单
    CorssCursorInfo: { Left: 2, Right: 0, Bottom: 1, IsShowCorss: true },  //十字光标刻度设置

    KLine: {
      DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
      Right: 0, //复权 0 不复权 1 前复权 2 后复权
      Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
      MaxReqeustDataCount: 1000, //日线数据最近1000天
      MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
      PageSize: 50, //一屏显示多少数据
      IsShowTooltip: false //是否显示K线提示信息
    },

    KLineTitle: //标题设置
    {
      IsShowName: false, //不显示股票名称
      IsShowSettingInfo: false //不显示周期/复权
    },

    Border: //边框
    {
      Left: 20, //左边间距
      Right: 1, //右边间距
      Top: 1,
      Bottom: 1
    },

    Frame: //子框架设置
      [
        {
          SplitCount: 4,
          IsShowLeftText: false, 	//不显示左边刻度文字
          IsShowRightText: true,    	//显示右边刻度文字                      
          Custom:
            [
              {
                Type: 0,
                Position: 'left',
              }
            ]
        },
        { SplitCount: 3, StringFormat: 0, IsShowLeftText: false, IsShowRightText: true },
        { SplitCount: 3, StringFormat: 0, IsShowLeftText: false, IsShowRightText: true }
      ],
    ExtendChart:    //扩展图形
      [
        { Name: 'KLineTooltip' }  //手机端tooltip
      ],
  };
  return data;
}
// 周期
DefaultData.GetPeriodData = function (name) {
  const mapPeriod = new Map([
    ["分时", { Value: 1, KLineShow: false, MinuteShow: true }],
    // ["五日", { Value: 5, KLineShow: false, MinuteShow: true }],
    ["日线", { Value: 0, KLineShow: true, MinuteShow: false }],
    ["周线", { Value: 1, KLineShow: true, MinuteShow: false }],
    ["月线", { Value: 2, KLineShow: true, MinuteShow: false }],
    ["年线", { Value: 3, KLineShow: true, MinuteShow: false }],
    ["1分钟", { Value: 4, KLineShow: true, MinuteShow: false }],
    ["5分钟", { Value: 5, KLineShow: true, MinuteShow: false }],
    ["15分钟", { Value: 6, KLineShow: true, MinuteShow: false }],
    ["30分钟", { Value: 7, KLineShow: true, MinuteShow: false }],
    ["60分钟", { Value: 8, KLineShow: true, MinuteShow: false }]
  ]);
  if (!mapPeriod.has(name)) return null;

  return mapPeriod.get(name);
}
//k线指标菜单配置 如MACD
DefaultData.GetIndexMenu = function () {
  var data =   //ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
    [
      { Name: 'KDJ', ID: 'KDJ', WindowIndex: 1 },
      { Name: 'MACD', ID: 'MACD', WindowIndex: 2 },
      { Name: 'RSI', ID: 'RSI', WindowIndex: 1 },
      { Name: 'BOLL', ID: 'BOLL', WindowIndex: 0 },
      { Name: 'VOL', ID: 'VOL', WindowIndex: 1 },
      { Name: '均线', ID: '均线', WindowIndex: 0 },
    ];

  return data;
}


export default {
  name: 'Horizontal',
  inject: ['reload'],
  data () {
    return {
      current: 1,//当前的k线指标 如 MACD等
      TabKlineIndex: 1,  //当前的k线指标 如 MACD等
      PeriodList: [
        { Name: "分时", Value: 1 },
        // { Name: "五日", Value: 5 },
        { Name: "日线", Value: 0 },
        { Name: "周线", Value: 1 },
        { Name: "月线", Value: 2 },
        { Name: "年线", Value: 3 },
        { Name: "1分钟", Value: 4 },
        { Name: "5分钟", Value: 5 },
        { Name: "15分钟", Value: 6 },
        { Name: "30分钟", Value: 7 },
        { Name: "60分钟", Value: 8 }
      ],
      Minute: {
        JSChart: null,
        IsShow: true,
        Option: DefaultData.GetMinuteOption()
      },
      Kline: {
        JSChart: null,
        IsShow: false,
        Option: DefaultData.GetKlineOption()
      },
      //指标菜单
      Index:
      {
        Menu: DefaultData.GetIndexMenu(),       //菜单项
        SelItem: DefaultData.GetIndexMenu()[0],
        IsShow: false,
      },
      Symbol: '600000.sh',
      TabTextIndex: 0,
      Name: "",
      StockData: DefaultData.GetStockData(),
      Tooltip: {
        IsshowTooltip: false,
        Data: {
          Date: { Text: '' },
          Open: { Text: '', Color: '' },
          High: { Text: '', Color: '' },
          Low: { Text: '', Color: '' },
          Close: { Text: '', Color: '' },
          YClose: { Text: '' },
          Vol: { Text: '' },
          Amount: { Text: '' },
        }
      },
      MinuteTooltip: {
        IsshowTooltip: false,
        Data: {
          Time: { Text: '' },
          AvPrice: { Text: '', Color: '' },
          Open: { Text: '', Color: '' },
          High: { Text: '', Color: '' },
          Low: { Text: '', Color: '' },
          Close: { Text: '', Color: '' },
          Increase: { Text: '', Color: '' },
          Risefall: { Text: '', Color: '' },
          Vol: { Text: '' },
          Amount: { Text: '' },
        }
      }

    }
  },
  created () {
    if (Tools.getURLParams("symbol")) {
      console.log("Tools.getURLParams::::::", Tools.getURLParams("symbol"))
      this.Symbol = Tools.getURLParams("symbol");
    }
    if (Tools.getURLParams("index")) {
      // console.log("Tools.getURLParams::::::",Tools.getURLParams("index"))
      this.TabTextIndex = Tools.getURLParams("index");
      console.log(this.TabTextIndex);
      var index = Tools.getURLParams("index");
      console.log(index);
      this.Name = this.PeriodList[index].Name;
      console.log(this.name);
    }
  },
  mounted () {
    this.OnSize();
    var _this = this;
    window.onresize = function () {
      _this.OnSize();
    };

    this.JSStock = JSCommonStock.JSStockInit();
    this.InitalStock();
    this.JSStock.RequestData();

    this.ChangeChartTab(this.Name, this.TabTextIndex);
  },
  watch: {
  },
  directives: {
    trigger: {
      inserted (el, binding, index) {
        if (index.data.key === 0) {
          el.click();
          setTimeout(function () {
            el.click();
            setTimeout(function () {
              el.click()
            }, 100)
          }, 100)
        }
      }
    }
  },
  methods: {
    OnSize () {
      var width = window.innerWidth - 76;
      var chartHeight = window.innerHeight;

      $('#minuteChart').width(width);
      $('#minuteChart').height(chartHeight);

      $('#kline').width(width);
      $('#kline').height(chartHeight);
    },
    // 回到竖屏
    GoBack () {
      this.reload();
      // this.$router.back(-1);
      this.$router.push({ path: '/helloWorld' });
    },
    ChangeChartTab (name, index) {
      this.TabTextIndex = index;
      var period = DefaultData.GetPeriodData(name);
      if (!period) return;
      if (period.KLineShow) this.ChangeKLinePeriod(period.Value);
      this.Kline.IsShow = period.KLineShow;
      if (period.MinuteShow) this.ChangeMinutePeriod(period.Value);
      this.Minute.IsShow = period.MinuteShow;

      // k线 MACD　指标的有无
      if (this.TabTextIndex === 0) {
        this.Index.IsShow = false;
      } else {
        this.Index.IsShow = true;
      }
    },

    //切换k线副图指标   MACD
    ChangeIndex (windowIndex, indexName) {
      if (this.Kline.JSChart) this.Kline.JSChart.ChangeIndex(windowIndex.WindowIndex, windowIndex.Name);
    },
    change (index) {
      this.current = index;
    },
    ChangeKLinePeriod (period)  //历史K线周期切换
    {
      if (!this.Kline.JSChart)    //不存在创建
      {
        this.Kline.Option.KLine.Period = period;
        this.CreateKLineChart();
      }
      else {
        this.Kline.JSChart.ChangePeriod(period);
      }
    },
    CreateKLineChart ()  //创建K线图
    {
      if (this.Kline.JSChart) return;
      this.Kline.Option.Symbol = this.Symbol;
      let chart = JSCommon.JSChart.Init(this.$refs.kline);
      // var blackStyle = JSCommon.HQChartStyle.GetStyleConfig(JSCommon.STYLE_TYPE_ID.BLACK_ID);
      // JSCommon.JSChart.SetStyle(blackStyle);
      // this.$refs.kline.style.backgroundColor = '#1a1c30';

      // 以下是设置 自己的数据域名
      HQChart.Chart.JSChart.SetDomain('http://47.115.162.68:8762');   　//设置K线的数据API域名
      HQChart.Chart.JSComplier.SetDomain('http://47.115.162.68:8762'); //设置麦语法执行中的数据API域名
      this.Kline.Option.NetworkFilter = (data, callback) => {
        data.PreventDefault = true;
        this.NetworkFilter(data, callback);
      };
      // 以上是设置 自己的数据域名

      chart.SetOption(this.Kline.Option);
      chart.AddEventCallback({ event: JSCommon.JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE, callback: this.OnClickIndexTitle });//点击事件通知回调
      chart.AddEventCallback({ event: JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW, callback: (event, data, obj) => { this.UpdateTitle(event, data, obj); } });
      this.Kline.JSChart = chart;
    },
    CreateMinuteChart () //创建日线图
    {
      if (this.Minute.JSChart) return;
      this.Minute.Option.Symbol = this.Symbol;
      let chart = JSCommon.JSChart.Init(this.$refs.minute);
      // 以下主要是设置背景颜色
      var blackStyle = JSCommon.HQChartStyle.GetStyleConfig(JSCommon.STYLE_TYPE_ID.BLACK_ID);
      blackStyle.FrameTitleBGColor = "#F7F7F7";
      JSCommon.JSChart.SetStyle(blackStyle);
      this.$refs.minute.style.backgroundColor = '#ffffff';
      // 以下是设置 自己的数据域名
      HQChart.Chart.JSChart.SetDomain('http://47.115.162.68:8762');
      HQChart.Chart.JSComplier.SetDomain('http://47.115.162.68:8762');
      //网络请求回调函数
      this.Minute.Option.NetworkFilter = (data, callback) => {
        data.PreventDefault = true;
        this.MinuteNetworkFilter(data, callback);
      };
      // 以上是设置 自己的数据域名
      chart.SetOption(this.Minute.Option);
      chart.AddEventCallback({ event: JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW, callback: (event, data, obj) => { this.UpdateMinuteTitle(event, data, obj); } });
      this.Minute.JSChart = chart;
    },
    //第三方  分时数据 （自己的数据）
    MinuteNetworkFilter (data, callback) {
      // console.log('[BitKLine::NetworkFilter] data', data, callback);
      switch (data.Name) {
        case 'MinuteChartContainer::RequestMinuteData':   //分钟全量数据下载
          this.RequestMinuteData(data, callback, { PageSize: 500 });
          console.log('调用了MinuteChartContainer::RequestMinuteData');
          break;
        case 'KLineChartContainer::RequestMinuteRealtimeData':  //分钟实时数据更新
          this.RequestMinuteRealtimeData(data, callback);
          console.log('调用了KLineChartContainer::RequestMinuteRealtimeData');
          break;
      }
    },
    //对接第3方  日线数据， 需要显示那些数据对就对接哪些数据，不需要的数据不需要对接
    NetworkFilter (data, callback)   //第3方数据替换接口
    {
      // console.log('[BitKLine::NetworkFilter] data', data);
      switch (data.Name) {
        case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
          this.ReqeustHistoryMinuteData(data, callback, { PageSize: 500 });
          console.log('调用了KLineChartContainer::ReqeustHistoryMinuteData 1分钟历史k线的');
          break;
        case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
          this.RequestMinuteRealtimeData(data, callback);
          console.log('调用了KLineChartContainer::RequestMinuteRealtimeData');
          break;
        case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
          this.RequestHistoryData(data, callback, { PageSize: 50 });
          console.log('调用了KLineChartContainer::RequestHistoryData');
          break;
        case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
          this.RequestRealtimeData(data, callback);
          console.log('调用了KLineChartContainer::RequestRealtimeData');
          break;
        case 'APIScriptIndex::ExecuteScript':                //BS 指标数据指示
          this.ExecuteScript(data, callback, { PageSize: 500 });
          console.log('调用了APIScriptIndex::ExecuteScript');
          break;
      }
    },

    // BS 数据的 请求
    ExecuteScript (data, callback, option) {
      data.PreventDefault = true;
      console.log(data);
      // console.log(this);
      var klineData = [];
      var symbol = data.Request.Data.symbol; //股票代码
      var name = data.Name;
      setTimeout(() => {
        var hqchart = data.HQChart;
        var kData = hqchart.ChartPaint[0].Data;

        var myIcon = [];
        var paramsSell = {
          pageNum: 1,
          pageSize: 1000,
          prodCode: myProdCode.prodCode,
        };
        $.ajax({
          type: 'POST',
          url: '/api' + '/quotationService/quotation/getAndroidKlineDayPage',
          dataType: 'json',
          data: JSON.stringify(paramsSell),
          contentType: 'application/json;charset=utf-8',
          async: false,
          success: function (recvData) {
            console.log(recvData);
            $.each(recvData.data.records, function (index, myobj) {
              var sp1 = myobj['Date']; //日期
              var sp = sp1.split('/');
              var mydate = sp[0];
              if ((sp[1] + '').length == 1) {
                mydate = mydate + '0' + sp[1];
              } else {
                mydate = mydate + sp[1];
              }
              if ((sp[2] + '').length == 1) {
                mydate = mydate + '0' + sp[2];
              } else {
                mydate = mydate + sp[2];
              }
              var myClose = myobj['Close'];
              if (Boolean(myobj['isBuyPoint']) === true) {
                myIcon.push({
                  Date: parseInt(mydate),
                  Value: myClose * 0.88,
                  Symbol: '\ue64a',
                  Color: 'rgb(240,0,0)',
                  Baseline: 2,
                });
              } else if (Boolean(myobj['isSellPoint']) === true) {
                myIcon.push({
                  Date: parseInt(mydate),
                  Value: myClose * 1.15,
                  Symbol: '\ue64b',
                  Color: 'rgb(60,179,113)',
                  Baseline: 1,
                });
              }
            });

          }
        });
        var line2 = {
          name: 'MULTI_SVGICON',
          type: 1,
          Draw: {
            DrawType: 'MULTI_SVGICON',
            DrawData: {
              Family: 'iconfont',
              Icon: myIcon,
            },
          }, //绘制图标数组
        };

        var apiData = {
          code: 0,
          stock: {
            name: hqchart.Name,
            symbol: hqchart.Symbol,
          },
          outdata: {
            date: kData.GetDate(),
            outvar: [line2],
          },
        };
        console.log(apiData);
        callback(apiData);
      }, 500)

    },
    //分时图全量  数据的请求
    RequestMinuteData (data, callback, option) {
      data.PreventDefault = true;  //禁止hqchart调用内置api数据
      var self = this;
      // console.log(data);

      var symbol = data.Request.Data.symbol; //股票代码
      var name = data.Name;

      var query = window.location.search.substring(1);
      var vars = query.split('&');
      // var myProdCode = {
      //   prodCode: '300661.SZ'
      // };


      // 昨日收盘价
      // var myPrice = [];
      var preclose_px = []
      // 股票代码
      var prodCode = [];
      // 股票名称
      var prodName = [];
      $.ajax({
        url: '/api' + '/quotationService/quotation/getRedisStock',
        contentType: 'application/json',
        data: JSON.stringify(myProdCode),
        type: "post",
        dataType: "json",
        async: true,
        success: (recvData) => {
          this.preclose_px = recvData.data.preclose_px;
          // myPrice.push(recvData.data.preclose_px);
          prodCode.push(recvData.data.prod_code);
          prodName.push(recvData.data.prod_name);
        },
        error: () => {
          // console.log('错误');
        }
      });

      $.ajax({
        type: 'post',
        url: 'http://szzx.api51.cn/szzx/trend/?prod_code=' + myProdCode.prodCode,
        dataType: 'json',
        async: false,
        success: function (recvData) {
          self.RecvMinuteData(recvData, callback, { Name: name, Symbol: symbol, Chart: data.Self }, option);
        }
      })

    },
    RecvMinuteData (recvData, callback, stockData, option) {
      this.JsonToHQChartMinuteHistoryData(recvData);
      callback(this.hqChart);
    },
    //日线周期  历史 数据的请求
    RequestHistoryData (data, callback, option) {
      data.PreventDefault = true;
      console.log(data);
      var self = this;
      var symbol = data.Request.Data.symbol; //股票代码
      var name = data.Name;
      var params = {
        pageNum: 1,
        pageSize: 1000,
        prodCode: myProdCode.prodCode,
      };
      $.ajax({
        type: 'POST',
        url: '/api' + '/quotationService/quotation/getAndroidKlineDayPage',
        dataType: 'json',
        data: JSON.stringify(params),
        contentType: 'application/json;charset=utf-8',
        async: false,
        success: function (recvData) {
          self.RecvHistoryData(recvData, callback, { Name: name, Symbol: symbol, Chart: data.Self }, option)
        },
      });
    },
    RecvHistoryData (recvData, callback, stockData) {
      this.JsonToHQChartHistoryData(recvData);
      // console.log(this.hqChartKline);
      callback(this.hqChartKline);
    },
    // 1分钟k线 当天最新 数据的请求
    RequestMinuteRealtimeData (data, callback, option) {
      data.PreventDefault = true;  //禁止hqchart调用内置api数据
      var self = this;
      var symbol = data.Request.Data.symbol; //股票代码
      var name = data.Name;
      $.ajax({
        type: 'GET',
        url:
          'http://szzx.api51.cn/szzx/kline/?prod_code=' +
          myProdCode.prodCode +
          '&period_type=60&tick_count=1000',
        dataType: 'json',
        async: false,
        success: function (recvData) {
          self.RecvMinuteRealtimeData(recvData, callback, { Name: name, Symbol: symbol, Chart: data.Self }, option);
        },
      });
    },
    RecvMinuteRealtimeData (recvData, callback, stockData) {
      this.JsonToHQChartHistoryMinuteData(recvData);
      callback(this.hqChartKline1);
    },
    // 1分钟k线 全量历史 数据的请求
    ReqeustHistoryMinuteData (data, callback, option) {
      console.log(data);
      data.PreventDefault = true;  //禁止hqchart调用内置api数据
      var self = this;
      var symbol = data.Request.Data.symbol; //股票代码
      var name = data.Name;
      $.ajax({
        type: 'GET',
        url:
          'http://szzx.api51.cn/szzx/kline/?prod_code=' +
          myProdCode.prodCode +
          '&period_type=60&tick_count=10000',
        dataType: 'json',
        async: false,
        success: function (recvData) {
          self.RecvHistoryMinuteData(recvData, callback, { Name: name, Symbol: symbol, Chart: data.Self }, option);
        },
      });
    },
    RecvHistoryMinuteData (recvData, callback, stockData) {
      this.JsonToHQChartHistoryMinuteData(recvData);
      callback(this.hqChartKline1);
    },


    //分时（历史/最新）数据转化为hqchart数据格式
    JsonToHQChartMinuteHistoryData (recvData) {
      var obj = recvData.data.candle;
      var yClose = null;
      var klineData = [];
      var minute = [];

      var time;
      var myday;
      var Open = []; //开盘价
      var High = []; // 最高价
      var Low = []; //最低价
      var Close = []; // 收盘价
      var Volume = []; // 成交量
      var Amount = []; // 成交额

      for (var key in obj) {
        var lines = obj[key].lines
        $.each(lines, function (index, myobj) {
          Open.push(myobj[2]); //开盘价
          High.push(myobj[4]); // 最高价
          Low.push(myobj[5]); //最低价
          Close.push(myobj[3]); // 收盘价
          Volume.push(myobj[6]); //成交量
          Amount.push(myobj[7]); // 成交额
          var time = new Date(parseInt(myobj[0] * 1000));
          myday =
            time.getFullYear() +
            '' +
            (time.getMonth() + 1 < 10
              ? '0' + (time.getMonth() + 1)
              : time.getMonth() + 1) +
            '' +
            (time.getDate() < 10
              ? '0' + time.getDate()
              : time.getDate());
          //时间
          var mytime =
            time.getHours() +
            '' +
            (time.getMinutes() < 10
              ? '0' + time.getMinutes()
              : time.getMinutes());
          minute.push({
            time: parseInt(mytime),
            avprice: myobj[1],
            price: myobj[3],
            open: myobj[2],
            high: myobj[4],
            low: myobj[5],
            vol: myobj[6] * 100,
            amount: myobj[7],
            increase: myobj[8],
            risefall: myobj[9],
          });
        });
        klineData.push([20200829, 11.32, 11.3, 11.3, 11.3, 11.3, 363806, 4111008, 825,])
        yClose = close;
      }
      this.hqChart = {
        stock: [
          {
            time: 1,
            date: myday,
            price: Close, //这个暂时不确定
            open: Open,
            yclose: this.preclose_px,
            high: High,
            low: Low,
            vol: Volume,
            amount: Amount,
            minute: minute,
            symbol: this.Symbol,
            name: this.Name,
          },
        ],
        start: 0,
        end: 20,
        data: klineData,
        count: 1,
        ticket: 0,
        version: 'HQ.Stock 2.0',
        message:
          '{"加载版块":0.0081,"查询mongo":5.7040000000000006,"封装数据":0.231,"排序":0.0072000000000000007,"分页":0.0089}',
        code: 0,
        servertime: '2020-08-18 21:06:56',
      };
      // console.log(this.hqChart);
      return klineData;
    },
    //日线周期  历史数据转化为hqchart数据格式
    JsonToHQChartHistoryData (recvData) {
      var klineData = [];
      console.log(recvData);
      $.each(recvData.data.records, function (index, myobj) {
        // console.log(myobj);
        var sp1 = myobj['Date']; //日期
        var sp = sp1.split('/');
        var mydate = sp[0];
        if ((sp[1] + '').length == 1) {
          mydate = mydate + '0' + sp[1];
        } else {
          mydate = mydate + sp[1];
        }
        if ((sp[2] + '').length == 1) {
          mydate = mydate + '0' + sp[2];
        } else {
          mydate = mydate + sp[2];
        }
        // yyyy/MM/dd,price,open,high,low,close,volume,value
        klineData.push([
          parseInt(mydate),
          parseFloat(myobj['Open']),
          parseFloat(myobj['Open']),
          parseFloat(myobj['High']),
          parseFloat(myobj['Low']),
          parseFloat(myobj['Close']),
          parseInt(parseFloat(myobj['Volume']) / 100),
          // Boolean(myobj['isBuyPoint']),
          // Boolean(myobj['isSellPoint']),
        ]);
      });
      this.hqChartKline = {
        data: klineData,
        symbol: '600000.sh',
        name: '浦发银行',
        start: 4911,
        end: 3912,
        count: 4912,
        ticket: 0,
        version: '2.0',
        message: null,
        code: 0,
        servertime: '2020-08-12 20:54:25',
      }
      // console.log(this.hqChartKline);
      return klineData;
    },
    // 1分钟周期  历史数据 转换为  hqchart  数据格式
    JsonToHQChartHistoryMinuteData (recvData) {
      var klineData = [];
      console.log(recvData);
      var obj = recvData.data.candle;
      for (var key in obj) {
        var lines = obj[key].lines
        $.each(lines, function (index, myobj) {
          var time = new Date(myobj[0] * 1000);
          var mydate =
            time.getFullYear() +
            '' +
            (time.getMonth() + 1 < 10
              ? '0' + (time.getMonth() + 1)
              : time.getMonth() + 1) +
            '' +
            (time.getDate() < 10
              ? '0' + time.getDate()
              : time.getDate());
          // console.log(mydate); 2020091
          //时间
          var mytime =
            time.getHours() +
            '' +
            (time.getMinutes() < 10
              ? '0' + time.getMinutes()
              : time.getMinutes());

          klineData.push([
            parseFloat(mydate), // 日期
            0,
            parseFloat(myobj[1]), //开
            parseFloat(myobj[3]), //高
            parseFloat(myobj[4]), //低
            parseFloat(myobj[2]), //收
            parseFloat(myobj[5]), // 这里显示的是 量
            parseFloat(myobj[6]), // 这里显示的是 额
            parseInt(mytime), //时间
            '',
          ]);
        })
      }

      this.hqChartKline1 = {
        data: klineData,
        symbol: '600000.sh',
        name: '浦发银行',
        start: -1,
        end: 0,
        count: 4916,
        ticket: 172,
        version: '2.0',
        message: null,
        code: 0,
        servertime: '2020-08-19 20:45:15',
      };
      return klineData;
    },
    //日线最新数据转化为hqchart数据格式
    JsonToHQChartRealtimeData (recvData) {
      var stockData = {};
      var data = recvData.data.series;
      var yClose = null;
      for (var i in data) {
        var item = data[i];
        var aryItem = item.split('|');
        stockData.date = parseInt(aryItem[0] / 1000000);
        stockData.open = parseFloat(aryItem[1]);
        stockData.high = parseFloat(aryItem[2]);
        stockData.low = parseFloat(aryItem[3]);
        stockData.price = parseFloat(aryItem[4]);   //收盘价
        stockData.vol = parseFloat(aryItem[5]);
        stockData.yclose = yClose;
        stockData.amount = null;

        yClose = stockData.price;
      }

      return stockData;
    },


    UpdateTitle (event, data, obj) {
      var objNew = {
        Date: { Text: '' },
        Open: { Text: '', Color: '' },
        High: { Text: '', Color: '' },
        Low: { Text: '', Color: '' },
        Close: { Text: '', Color: '' },
        YClose: { Text: '' },
        Vol: { Text: '' },
        Amount: { Text: '' },
      };
      var data = data.Draw;
      objNew.Date = data.Date.toString().substring(0, 4) + "-" + data.Date.toString().substring(4, 6) + "-" + data.Date.toString().substring(6, 8);

      objNew.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High, 2);
      objNew.High.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.High, data.YClose);

      objNew.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low, 2);
      objNew.Low.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Low, data.YClose);

      objNew.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open, 2);
      objNew.Open.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Open, data.YClose);

      objNew.Close.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Close, 2);
      objNew.Close.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Close, data.YClose);

      objNew.YClose.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.YClose, 2);
      objNew.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol, 2);
      objNew.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount, 2);

      // console.log(objNew,"[UpdateTitle]  objNew::")
      this.Tooltip.Data = objNew;
      this.Tooltip.IsshowTooltip = false;
      if (this.Kline.JSChart.JSChartContainer.IsOnTouch == true && event.FunctionName == 'DrawDynamicInfo') //手是否在屏幕上
      {
        this.Tooltip.IsshowTooltip = true;
      }
    },
    UpdateMinuteTitle (event, data, obj) {
      console.log('[UpdateMinuteTitle]  data', data)
      var objNew = {
        Time: { Text: '' },
        AvPrice: { Text: '', Color: '' },
        Open: { Text: '', Color: '' },
        High: { Text: '', Color: '' },
        Low: { Text: '', Color: '' },
        Close: { Text: '', Color: '' },
        Increase: { Text: '', Color: '' },
        Risefall: { Text: '', Color: '' },
        Vol: { Text: '' },
        Amount: { Text: '' },
      };
      var data = data.Draw;
      if (data == null) return;
      if (data.Time >= 1000) {
        objNew.Time = data.Time.toString().substring(0, 2) + ":" + data.Time.toString().substring(2, 4);
      } else {
        objNew.Time = data.Time.toString().substring(0, 1) + ":" + data.Time.toString().substring(1, 3);
      }
      objNew.AvPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.AvPrice, 2);
      objNew.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High, 2);
      objNew.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low, 2);
      objNew.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open, 2);
      objNew.Close.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Close, 2);

      objNew.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase, 2) + "%";
      objNew.Increase.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Increase);

      objNew.Risefall.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Risefall, 2);
      objNew.Risefall.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Risefall);

      objNew.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol, 2);
      objNew.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount, 2);

      this.MinuteTooltip.Data = objNew;
      this.MinuteTooltip.IsshowTooltip = false;

      if (this.Minute.JSChart.JSChartContainer.IsOnTouch == true && event.FunctionName == 'DrawDynamicInfo') //手是否在屏幕上
      {
        this.MinuteTooltip.IsshowTooltip = true;
      }
    },
    //走势图多日切换
    ChangeMinutePeriod (period) {
      if (!this.Minute.JSChart)   //不存在创建
      {
        this.Minute.Option.DayCount = period;
        this.CreateMinuteChart();
      }
      else {
        if (period == 1) {
          this.IsFiveminute = false;

        } else if (period == 5) {
          this.IsFiveminute = true;
        }
        this.OnSize();
        this.Minute.JSChart.OnSize();
        this.Minute.JSChart.ChangeDayCount(period);
      }
    },

    UpdateData: function (id, arySymbol, dataType, jsStock) {
      if (id != this.ID) return;

      let isIndex = this.IsSHSZIndex();
      let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
      if (arySymbol.indexOf(this.Symbol) < 0) return;

      let data = {};    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}
      data.Name = { Text: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.NAME) };
      let date = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DATE);
      let time = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.TIME);
      if (date != null && time != null) {
        data.Date = date.toString().substring(4, 6) + "-" + date.toString().substring(6, 8);
        if (time.toString().length == 5) {
          data.Time = 0 + time.toString().substring(0, 1) + ":" + time.toString().substring(1, 3) + ":" + time.toString().substring(3, 5);
        } else {
          data.Time = time.toString().substring(0, 2) + ":" + time.toString().substring(2, 4) + ":" + time.toString().substring(4, 6)
        }
      }

      data.Price = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PRICE), Color: '', Text: '--' };
      data.RiseFallPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE) };
      data.Increase = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.INCREASE), Color: '', Text: '--' };
      data.High = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.HIGH), Color: '', Text: '--' };
      data.Low = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.LOW), Color: '', Text: '--' };
      data.Open = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.OPEN), Color: '', Text: '--' };
      data.Amount = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMOUNT), Text: '--' };
      data.Vol = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.VOL), Text: '--' };
      data.BookRate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE), Text: '--' };
      data.BookDiffer = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER), Text: '--' };
      data.Volratio = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.VOLRATIO), Text: '--' };
      data.CapitalTatol = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.CAPITAL_TOTAL), Text: '--' };
      data.CapitalA = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.CAPITAL_A), Text: '--' };
      data.MaxPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MAX_PRICE), Text: '--' };
      data.MinPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MIN_PRICE), Text: '--' };
      let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);
      data.YClose = { Value: yClose, Text: '--' };

      let SellFive = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.SELL5);
      let BuyFive = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BUY5);
      let Deal = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DEAL);
      //卖五
      if (SellFive && SellFive.length == 5) {
        var str1 = [];
        for (var i in SellFive) {
          var dataN = SellFive[i];
          var arr = ["卖五", "卖四", "卖三", "卖二", "卖一"];
          str1.push({
            name: arr[4 - i],
            dataPrice: dataN.Price != null ? dataN.Price != 0 ? dataN.Price.toFixed(2) : '' : '--',
            dataVol: dataN.Vol != 0 ? dataN.Vol : "",
            color: JSCommon.IFrameSplitOperator.FormatValueColor(dataN.Price, yClose)
          })
        }
        data.SellerFive = str1.reverse();
      }
      //买五
      if (BuyFive && BuyFive.length == 5) {
        var str2 = [];
        for (var i in BuyFive) {
          var dataM = BuyFive[i];
          var arr = ["买一", "买二", "买三", "买四", "买五"];
          str2.push({
            name: arr[i],
            dataPrice: dataM.Price != null ? dataM.Price != 0 ? dataM.Price.toFixed(2) : '' : '--',
            dataVol: dataM.Vol != 0 ? dataM.Vol : "",
            color: JSCommon.IFrameSplitOperator.FormatValueColor(dataM.Price, yClose)
          })
        }
        data.BuyerFive = str2;
      }
      //分笔
      if (Deal != undefined) {
        var str3 = [];
        for (var i in Deal) {
          var item = Deal[i];
          var timer = item.Time;
          timer = timer.toString();
          var timeStr, newTime;
          if (timer.length == 5) {
            timeStr = "0" + timer;
          } else if (timer.length == 6) {
            timeStr = timer;
          }
          newTime = timeStr.substring(0, 2) + ":" + timeStr.substring(2, 4);

          str3.push({
            timer: newTime,
            dataPrice: item.Price != null ? item.Price != 0 ? item.Price.toFixed(2) : '' : '--',
            dataVol: item.Vol != 0 ? item.Vol : '',
            color: JSCommon.IFrameSplitOperator.FormatValueColor(item.Price, yClose)
          })
        }
        data.Dealer = str3;
      }


      data.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Price.Value, 2);  //保留2位小数
      data.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Price.Value, yClose); //价格颜色判断
      this.PageBackColor = this.FormatBackColor(data.Price.Value, yClose);

      if (data.RiseFallPrice.Value == 0) data.RiseFallPrice.Text = '0.00';
      else data.RiseFallPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.RiseFallPrice.Value, 2);
      data.RiseFallPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.RiseFallPrice.Value, 0);

      if (data.Increase.Value == 0) data.Increase.Text = '0.00%';
      else data.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase.Value, 2) + '%';
      data.Increase.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Increase.Value, 0);

      data.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High.Value, 2);
      data.High.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.High.Value, yClose);

      data.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low.Value, 2);
      data.Low.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Low.Value, yClose);

      data.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open.Value, 2);
      data.Open.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Open.Value, yClose);

      data.MaxPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MaxPrice.Value, 2);
      data.MaxPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.MaxPrice.Value, yClose);

      data.MinPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MinPrice.Value, 2);
      data.MinPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.MinPrice.Value, yClose);

      data.YClose.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.YClose.Value, 2);

      data.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount.Value, 2);
      data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value, 2);
      data.BookRate.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.BookRate.Value, 2);
      data.BookDiffer.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.BookDiffer.Value, 2);
      data.Volratio.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Volratio.Value, 2);
      data.CapitalTatol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.CapitalTatol.Value, 2);
      data.CapitalA.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.CapitalA.Value, 2);

      if (isIndex) {
        //指数才有
        data.Down = { Text: '' }; //上涨
        data.Up = { Text: '' };   //下跌
        data.Unchanged = { Text: '' }; //平盘
        data.Stop = { Text: '' };
        let indexTop = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.INDEXTOP);
        if (indexTop) {
          data.Down.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Down, 0);
          data.Up.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Up, 0);
          data.Unchanged.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Unchanged, 0);
          data.Stop.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Stop, 0);
        }
      }
      else {
        data.Excahngerate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EXCHANGE_RATE), Color: '', Text: '--' };
        data.Pe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PE), Text: '--' };
        data.MarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MARKET_VALUE), Text: '--' };
        data.FlowMarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE), Text: '--' };
        data.Eps = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING), Text: '--' };
        data.ScrollEPS = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_EPS), Text: '--' };
        data.Roe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.ROE), Color: '', Text: '--' };
        data.Pb = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PB), Text: '--' };
        data.Amplitude = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE), Text: '--' };

        data.Roe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Roe.Value, 2);
        data.Roe.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Roe.Value, yClose);
        data.Excahngerate.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Excahngerate.Value, 2);
        data.Excahngerate.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Excahngerate.Value, yClose);
        data.MarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MarketV.Value, 0);
        data.FlowMarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.FlowMarketV.Value, 0);
        data.Pe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pe.Value, 2);
        data.Eps.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Eps.Value, 2);
        data.ScrollEPS.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.ScrollEPS.Value, 2);
        data.Pb.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pb.Value, 2);
        data.Amplitude.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amplitude.Value, 2);

        let events = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EVENTS);
        if (events) {
          // console.log('[StockInfo::UpdateData] events data ', this.Symbol, events);
          data.HK = events.HK;
          data.IsMargin = events.IsMargin; ////是否是融资融券标题
          data.IsHK = events.IsHK;  //是否有港股
          data.IsSHHK = events.IsSHHK;  //沪港通
        }
      }

      this.StockData = data;
    },

    //字段颜色格式化
    FormatBackColor (value, value2) {
      if (value != null && value2 == null)  //只传一个值的 就判断value正负
      {
        if (value == 0) return 'BackNull';
        else if (value > 0) return 'BackUp';
        else return 'BackDown';
      }

      //2个数值对比 返回颜色
      if (value == null || value2 == null) return 'BackNull';
      if (value == value2) return 'BackNull';
      else if (value > value2) return 'BackUp';
      else return 'BackDown';
    },
    InitalStock: function () {
      let read = this.JSStock.GetStockRead(this.ID, this.UpdateData);         //获取一个读取数据类,并绑定id和更新数据方法

      const stockField =//需要获取的数据字段
        [
          JSCommonStock.STOCK_FIELD_NAME.NAME,
          JSCommonStock.STOCK_FIELD_NAME.DATE,
          JSCommonStock.STOCK_FIELD_NAME.TIME,
          JSCommonStock.STOCK_FIELD_NAME.PRICE,
          JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE,
          JSCommonStock.STOCK_FIELD_NAME.INCREASE,
          JSCommonStock.STOCK_FIELD_NAME.HIGH,
          JSCommonStock.STOCK_FIELD_NAME.LOW,
          JSCommonStock.STOCK_FIELD_NAME.OPEN,
          JSCommonStock.STOCK_FIELD_NAME.YCLOSE,
          JSCommonStock.STOCK_FIELD_NAME.EXCHANGE_RATE,
          JSCommonStock.STOCK_FIELD_NAME.AMOUNT,
          JSCommonStock.STOCK_FIELD_NAME.VOL,
          JSCommonStock.STOCK_FIELD_NAME.PE,
          JSCommonStock.STOCK_FIELD_NAME.MARKET_VALUE,
          JSCommonStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE,
          JSCommonStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING,
          JSCommonStock.STOCK_FIELD_NAME.FINANCE_EPS,
          JSCommonStock.STOCK_FIELD_NAME.ROE,
          JSCommonStock.STOCK_FIELD_NAME.PB,
          JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE,
          JSCommonStock.STOCK_FIELD_NAME.EVENTS,
          JSCommonStock.STOCK_FIELD_NAME.SELL5,
          JSCommonStock.STOCK_FIELD_NAME.BUY5,
          JSCommonStock.STOCK_FIELD_NAME.DEAL,
        ];

      const indexField =
        [
          JSCommonStock.STOCK_FIELD_NAME.NAME,
          JSCommonStock.STOCK_FIELD_NAME.DATE,
          JSCommonStock.STOCK_FIELD_NAME.TIME,
          JSCommonStock.STOCK_FIELD_NAME.PRICE,
          JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE,
          JSCommonStock.STOCK_FIELD_NAME.INCREASE,
          JSCommonStock.STOCK_FIELD_NAME.HIGH,
          JSCommonStock.STOCK_FIELD_NAME.LOW,
          JSCommonStock.STOCK_FIELD_NAME.OPEN,
          JSCommonStock.STOCK_FIELD_NAME.YCLOSE,
          JSCommonStock.STOCK_FIELD_NAME.AMOUNT,
          JSCommonStock.STOCK_FIELD_NAME.VOL,
          JSCommonStock.STOCK_FIELD_NAME.INDEXTOP,
        ];

      if (this.IsSHSZIndex())
        read.SetQueryField(this.Symbol, indexField);
      else
        read.SetQueryField(this.Symbol, stockField);
    },
    IsSHSZIndex: function () {
      return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
    },
    IsShowChangeSymbol () {
      this.IsChangeSymbol = true;
    },
  },


}
</script>
<style lang="less" scoped>
body,
#app {
  height: 100%;
  width: 100%;
  color: #ffffff;
  background-color: #ffffff;
  overflow-y: hidden;
}

.container {
  // position: absolute;
  position: relative;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
// #minuteChart {
//   width: 83% !important;
//   background-color: #ffffff !important;
// }
// #kline {
//   width: 83% !important;
//   background-color: #ffffff !important;
// }

.PriceUp,
.PriceUp > span {
  color: #ee1515 !important;
}

.PriceDown,
.PriceDown > span {
  color: #199e00 !important;
}

.PriceNull {
  color: #ffffff !important;
}

.topSwiper {
  width: 30px;
  height: 100%;
  position: absolute;
  top: 0px;
  // right: 100px;
  right: 25px;
  line-height: 20px;
  z-index: 100;
  display: flex;
  flex: 1;
  flex-direction: column;
  // border-left: 2px solid #e1ecf2;
  box-sizing: border-box;
  // border-right: 2px solid #e1ecf2;
  font-size: 30px;
}

.oneItem {
  width: 100%;
  flex: 1;
  color: #333333;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  // border: 1px solid #ececec;
}

.oneItem > span {
  display: block;
  white-space: nowrap;
  transform: rotate(90deg);
}

.activeTopSwiper {
  // border: 1px solid #217cd9;
  box-sizing: border-box;
  color: #ff4d00;
}

/* 股票信息 */
.symbolInfo {
  width: 60px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  margin-right: 15px;
}

.symbolContent {
  height: calc(100% - 44px);
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.symbol_left {
  height: 40%;
}

.symbol_right {
  height: 60%;
}
.symbol_right_minute {
  height: 76%;
}

.symbol_left {
  /* background: red; */
  display: flex;
  flex: 1;
  flex-direction: column;
}

// .symbol_left>div{
//   flex:1;
// }
.symbol_left_0 {
  flex: 1;
  padding-left: 13px;
  box-sizing: border-box;
  font-size: 20px;
  .backIconWrap {
    display: inline-block;
    /*padding-right: 22px;*/
    height: 40px;
    width: 20px;
    line-height: 40px;
    font-size: 20px;
    transform: rotate(90deg);
  }
}

.symbol_left_1 {
  flex: 2;
  // display: flex;
  flex-direction: row;
  margin-left: -6px;
  margin-right: 8px;
  transform: rotate(90deg);
}
.symbol_left_Kline {
  margin: 35px -6px 0 10px;
  flex-direction: row;
  font-size: 16px;
  transform: rotate(90deg);
  display: flex;
}

.symbol_left_Kline > div {
  display: inline-block;
  // justify-content: center;
  /* align-items: center; */
  white-space: nowrap;
}

// .symbol_left_1>div{
//   width: 50%;
//   display: flex;
//   justify-content: center;
//   /* align-items: center; */
//   // transform:rotate(90deg);
//   white-space:nowrap;
// }

.nameCss {
  font-size: 15px;
  font-weight: 600;
  // padding-top:33px;
  box-sizing: border-box;
  width: 80px;
  margin-top: -3px;
}
.nameCss-kline {
  font-size: 16px;
  font-weight: 600;
  // padding-top:33px;
  box-sizing: border-box;
  width: 80px;
}

.symbolCss {
  font-size: 12px;
  color: #f5f5f5;
  padding-top: 20px;
  box-sizing: border-box;
}
.symbolCss-kline {
  font-size: 16px;
  color: #f5f5f5;
  // padding-top:30px;
  box-sizing: border-box;
  margin-left: 10px;
}

.symbol_left_1 > .increaseCss,
.symbol_left_1 > .increaseCss_1 {
  justify-content: flex-start;
  /* align-items: center; */
  font-size: 12px;
  font-weight: 600;
}

.topCss {
  padding-top: 20px;
  box-sizing: border-box;
}

.bottomCss {
  // padding-top:34px;
  box-sizing: border-box;
  margin-top: -3px;
}

.symbol_left_2 {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(90deg);
  font-size: 19px;
  margin: 15px 0 0 0;
}

.redCss {
  color: red;
}

.greenCss {
  color: green;
}

.symbol_right {
  display: flex;
  flex-direction: column;
}

.symbol_right > div {
  height: 24%;
}

/* .symbol_right>.symbol_right_3{
  height:40%;
} */

.symbol_right_1 {
  display: flex;
  /* align-items: center; */
  white-space: nowrap;
  flex-direction: row;
}

.symbol_right_1 > div {
  width: 50%;
  transform: rotate(90deg);
  transform-origin: 25% 20%;
  font-size: 14px;
  color: #333333;
}

.titleCss {
  padding-right: 7px;
  // color: #f5f5f5;
  color: #333333;
}

.topCss1 {
  padding-top: 1px;
  box-sizing: border-box;
}

.bottomCss1 {
  padding-top: 9px;
  box-sizing: border-box;
}

.closeCss {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  margin: 10px -5px;
  color: #333333;
}

// k线指标  MACD
.indexWrap {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  justify-content: space-around;
  .indexItem {
    transform: rotate(90deg);
    font-weight: 500;
    font-size: 15px;
  }
}
</style>