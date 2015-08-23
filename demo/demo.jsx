import React from 'react';
import Component from '../src/index';

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

window.component = React.render(
  <Component {...config}/>,
  document.getElementById('demo')
);
