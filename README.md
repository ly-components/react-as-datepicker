# react-as-datepicker

一个React的日期选择器

[DEMO](http://lingyucoder.github.io/react-as-datepicker/demo/demo.html)

## Install

```
npm install --save react-as-datepicker
```

## Usage

```javascript
var DatePicker = require('react-as-datepicker');

var config = {
  year: 2015,
  month: 8,
  onChange: function(val) {
    console.log(val);
  },
  onDateChange: function(year, month) {
    console.log(year, month);
  },
  blacklist: [{
    from: '2015-8-1',
    to: '2015-8-2'
  }, {
    from: '2015-8-4',
    to: '2015-8-6'
  }, {
    from: '2015-8-10',
    to: '2015-8-14'
  }]
};

React.render(
  <DatePicker {...config}/>,
  document.getElementById('demo')
);
```

## Properties

```jsx
month: React.PropTypes.number, //初始展示的月份
year: React.PropTypes.number, //初始展示的年份
onChange: React.PropTypes.func, //日期变更时回调
onDateChange: React.PropTypes.func, //年或月变更时回调
value: React.PropTypes.oneOfType([ //初始值
  React.PropTypes.string,
  React.PropTypes.object
]),
blacklist: React.PropTypes.arrayOf(React.PropTypes.string) //不可选日期范围列表
```

## Event

通过`component.on('eventName', function() {})`绑定事件

### change(Date:date)

日期变更时触发

### dateChange(number:year, number:month)

年或月变更时触发

## Methods

### array:string getValue()

获取当前选择的日期

### setValue(array:string)

设置选择的日期

### on(string, function)

绑定事件

### once(string, function)

绑定仅触发一次的事件

### off(string [, function])

解绑事件，如果没提供回调，则解绑该事件下所有回调

### fire(string, [data1, data2...])

触发事件，除第一个参数外，其他参数将作为数据传给事件回调函数

### fireAll(string, [data1, data2...])

触发事件，在执行事件注册的回调函数前，先执行props上的onXXX方法

如`fireAll('change')`将会先执行`this.props.onChange`方法

## Development

开发：

```bash
$ npm start
$ open http://127.0.0.1:3000/demo/demo.html
```

发布：

```bash
$ npm run pub
```

## License

The MIT License (MIT)

Copyright (c) 2015 Lingyu Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
