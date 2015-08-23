import React from 'react';
import ReactMixin from 'react-mixin';
import EventMixin from 'react-as-event-mixin';

import {
  getCalendar,
  isDate,
  equal,
  date2obj,
	toDate,
	inRange
} from './util';

var cache = {};
var noop = () => {};

class DatePicker extends React.Component {
  static propTypes = {
		month: React.PropTypes.number,
    year: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onDateChange: React.PropTypes.func,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]),
		blacklist: React.PropTypes.arrayOf(React.PropTypes.string),
		name: React.PropTypes.string
	}
	static defaultProps = {
		month: null,
		year: null,
		onChange: noop,
		onDateChange: noop,
		value: null,
		blacklist: []
	}
  constructor(props) {
    super();
		var now = new Date();
		var vo = date2obj(now);
		this.state = {
			year: props.year || vo.year,
			month: props.month || vo.month,
			value: toDate(props.value)
		};
		this._blacklist = this._parseBlacklist(props.blacklist);
    this._handleSelect = this._handleSelect.bind(this);
		this._inBlackList = this._inBlackList.bind(this);
		this._dateChange = this._dateChange.bind(this);
  }
	componentWillReceiveProps(nextProps) {
		nextProps.blackList && (this._blacklist = this._parseBlacklist(nextProps.blacklist));
		var newState = {};
		nextProps.year && (newState.year = nextProps.year);
		nextProps.month && (newState.month = nextProps.month);
		nextProps.value && (newState.value = toDate(nextProps.value));
		this.setState(newState);
	}
	_parseBlacklist(blacklist) {
		return blacklist.map(item => ({
			from: toDate(item.from),
			to: toDate(item.to)
		}));
	}
  _handleSelect(e) {
    var target = e.target;
		var value = toDate({
			year: this.state.year,
			month: this.state.month,
			day: parseInt(target.getAttribute('data-day'))
		});
		if(equal(value, this.state.value)) return;
		this.setState({
			value
		});
    this.fireAll('change', e, value);
  }
	_inBlackList(day) {
		return this._blacklist.reduce((rst, range) => rst || inRange(day, range.from, range.to), false);
	}
	_dateChange(yearOffset, monthOffset) {
		return (e) => {
			var year = this.state.year + yearOffset;
			var month = this.state.month + monthOffset;
			month === 13 && (month = 1, year++);
			month === 0 && (month = 12, year--);
			this.setState({
				year,
				month
			});
			this.fireAll('dateChange', e, year, month);
		};
	}
  render() {
    var {
      year,
      month,
			value
    } = this.state;
    var data = cache[`${year}-${month}`];
		var today = new Date();
		var selected = date2obj(value);
    !data && (data = cache[`${year}-${month}`] = getCalendar(year, month));

    return (
      <div className="react-as-datepicker">
        <div className="header">
          <span className="opt prev-year" onClick={this._dateChange(-1, 0)}></span>
          <span className="opt prev-month" onClick={this._dateChange(0, -1)}></span>
          <span className="title">{year}年{month}月</span>
          <span className="opt next-month" onClick={this._dateChange(0, 1)}></span>
          <span className="opt next-year" onClick={this._dateChange(1, 0)}></span>
        </div>
				<div className="row">
					{
							['日', '一', '二', '三', '四', '五', '六'].map(day => <span className="day empty">{day}</span>)
					}
				</div>
        {
					data.map(row => (
						<div className="row">
							{
								row.map(day => {
									if(!day) return <div className="day empty"></div>
									var obj = {
										year,
										month,
										day
									};
									var disabled = this._inBlackList(obj);
									var className = 'day'
										+ (disabled ? ' disabled' : ' enable')
									 	+ (equal(obj, today) ? ' today' : '')
										+ (equal(obj, selected) ? ' selected' : '');
									return (
										<div data-month={month} data-year={year} data-day={day} onClick={!disabled && this._handleSelect} className={className}>{day}</div>
									);
								})
							}
						</div>
					))
				}
      </div>
    );
  }
}

ReactMixin(DatePicker.prototype, EventMixin);

export default DatePicker;
