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
		blacklist: [],
    name: null
	}
  constructor(props) {
    super();
		var now = new Date();
		var vo = date2obj(now);
		this.state = {
			year: props.year || vo.year,
			month: props.month || vo.month,
			value: toDate(props.value),
      editing: false,
      editYear: null,
      editMonth: null
		};
		this._blacklist = this._parseBlacklist(props.blacklist);
    this._handleSelect = this._handleSelect.bind(this);
		this._inBlackList = this._inBlackList.bind(this);
		this._dateChange = this._dateChange.bind(this);
    this._handleEditorClick = this._handleEditorClick.bind(this);
    this._handleYearChange = this._handleYearChange.bind(this);
    this._handleMonthChange = this._handleMonthChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
  }
	componentWillReceiveProps(nextProps) {
		nextProps.blackList && (this._blacklist = this._parseBlacklist(nextProps.blacklist));
		var newState = {};
		nextProps.year && (newState.year = nextProps.year);
		nextProps.month && (newState.month = nextProps.month);
		nextProps.value && (newState.value = toDate(nextProps.value));
		this.setState(newState);
	}
	getValue() {
		return this.state.value;
	}
	setValue(val) {
		if(this._inBlackList(val)) return this;
		this.setState({
			value: toDate(val)
		});
		return this;
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
    this.fireAll('change', value);
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
			this.fireAll('dateChange', year, month);
		};
	}
  _handleEditorClick() {
    this.setState({
      editing: true,
      editYear: this.state.year,
      editMonth: this.state.month
    });
  }
  _handleYearChange(e) {
    var target = e.target;
    this.setState({
      editYear: target.value
    });
  }
  _handleMonthChange(e) {
    var target = e.target;
    this.setState({
      editMonth: target.value
    });
  }
  _handleBlur() {
    var iptYear = React.findDOMNode(this.refs.iptYear);
    var iptMonth = React.findDOMNode(this.refs.iptMonth);
    setTimeout(() => {
      if(document.activeElement === iptYear || document.activeElement === iptMonth) return;
      var year = parseInt(this.state.editYear);
      var month = parseInt(this.state.editMonth);
      if(month > 12 || month < 1) return;
      if(year > 2999 || year < 0) return;
      this.setState({
        editing: false,
        editYear: null,
        editMonth: null,
        year: year,
        month: month
      });
    }, 0);
  }
  render() {
    var {
      year,
      month,
			value,
      editing,
      editYear,
      editMonth
    } = this.state;
    var data = cache[`${year}-${month}`];
		var today = new Date();
		var selected = date2obj(value);
    !data && (data = cache[`${year}-${month}`] = getCalendar(year, month));

    return (
      <div className="react-as-datepicker">
        { this.props.name && <input type="hidden" name={this.props.name} value={value ? value.getTime() : ''}></input>}
        <div className="header">
          <span className="opt prev-year" onClick={this._dateChange(-1, 0)}></span>
          <span className="opt prev-month" onClick={this._dateChange(0, -1)}></span>
          <span className="title" onClick={this._handleEditorClick}>
            { editing ? <span><input ref="iptYear" className="ipt-year" onBlur={this._handleBlur} onChange={this._handleYearChange} value={editYear}></input></span> : year }
            年
            { editing ? <span><input ref="iptMonth" className="ipt-month" onBlur={this._handleBlur} onChange={this._handleMonthChange} value={editMonth}></input></span> : month }
            月
          </span>
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
