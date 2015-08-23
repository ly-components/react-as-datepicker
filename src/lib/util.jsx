function timeFormat(date, format) {
  if(!date) return '';
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}

function getFirstDay(year, month) {
  var firstDay = new Date(year, month - 1, 1);
  return firstDay.getDay();
}

function getMonthLen(year, month) {
  var nextMonth = new Date(year, month, 1);
  nextMonth.setHours(nextMonth.getHours() - 3);
  return nextMonth.getDate();
}

function getCalendar(year, month) {
  var monthLen = getMonthLen(year, month);
  var firstDay = getFirstDay(year, month);
  var list = [
    []
  ];
  var i,
    cur,
    row,
    col;
  for (i = firstDay; i--;) {
    list[0].push('');
  }
  for (i = 1; i <= monthLen; i++) {
    cur = i + firstDay - 1;
    row = Math.floor(cur / 7);
    col = cur % 7;
    list[row] = list[row] || [];
    list[row].push(i);
  }
  var lastRow = list[row];
  for (i = 7 - lastRow.length; i--;) {
    lastRow.push('');
  }
  return list;
}

function isDate(v) {
  return Object.prototype.toString.call(v).toLowerCase() === '[object date]';
}

function equal(a, b) {
  a = isDate(a) ? date2obj(a) : a;
  b = isDate(b) ? date2obj(b) : b;
  if((a && !b) || (b && !a)) return false;
  if(!a && !b) return true;
  return (a.year === b.year) && (a.month === b.month) && (a.day === b.day);
}

function obj2date(obj) {
  if(!obj) return null;
  return new Date(`${obj.year}-${obj.month}-${obj.day}`);
}

function date2obj(date) {
  if(!date) return {};
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

function toDate(v) {
  if(!v) return null;
  if(typeof v === 'string')
    return new Date(v);
  else if(isDate(v))
    return v;
  else if(v.year && v.month && v.day)
    return obj2date(v);
  else
    return null;
}

function inRange(date, from, to) {
  date = toDate(date).getTime();
  var can = true;
  from && (can = can && date >= from.getTime());
  to && (can = can && date < to.getTime());
  return can;
}

export default {
  getCalendar,
  isDate,
  equal,
  obj2date,
  date2obj,
  toDate,
  inRange,
  timeFormat
};
