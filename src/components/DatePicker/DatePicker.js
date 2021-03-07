import React from 'react'
import "./DatePicker.scss"
import timeFunc from '../../functions/timeFunctions'

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'

const DatePicker = (props) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div style={{position: "relative"}}>
      
      <label className="datePickerLabel">
              {timeFunc.datesAreOnSameDay(props.value, timeFunc.startOfToday()) ? "(today)" : console.log(props)}
      </label>

      <KeyboardDatePicker
        margin="none"
        id="date-picker-dialog"
        format="dd/MM/yyyy"
        name="setStartDate"
        className="datePicker"
        value={props.value}
        onChange={props.onChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </div>
  </MuiPickersUtilsProvider>
);

export default DatePicker;