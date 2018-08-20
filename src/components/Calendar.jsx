import React from "react";
import dateFns from "date-fns";
import Popover from "@material-ui/core/Popover"
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import IconButton from '@material-ui/core/IconButton';
import TextField from "@material-ui/core/TextField";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

class Calendar extends React.Component {
    /*
    State object to store states of various components
     */
    state = {
    currentMonth: new Date(), /*To know which month to present*/
    selectedDate: new Date(), /* To keep track of date selected */
    anchorEl:null,            /*To Anchor Popover */
      dispOrAdd:true,        /*To either display Form or Cards */
      eventsArray:[],       /*To store events of a day */
      name:'',              /*Event Name*/
      eventTime:'09:30'     /*Event Time*/
  };

    /*
    Renders Header : App Name
    */
    renderHeader() {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="header row flex-middle">
          <div className="col col-start" onClick={this.prevMonth}>
              <IconButton  component="span" >
                  <KeyboardArrowLeft/>
              </IconButton>
      </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
          <div className="col col-end" onClick={this.nextMonth}>
              <IconButton  component="span" >
                  <KeyboardArrowRight/>
              </IconButton>
          </div>
      </div>
    );
    }
    /*
    To Render Days Monday to Sunday
    */
    renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
    }
    /*
    To render Popup when a date cell is Clicked
    */
    renderPopOver(){
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const date = dateFns.format(this.state.selectedDate,'MMMM DD YYYY');
    console.log(this.state.selectedDate);
    const formStyle = this.state.dispOrAdd ?  {display:'none'}:{};
    const dispStyle = this.state.dispOrAdd ?  {}:{display:'none'};
    const cardStyle = {display:'flex'};
    return <Popover
      id="simple-popper"
      open={open}
      anchorEl={anchorEl}
      onClose={this.handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: 300, left: 500 }}
      anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
      }}
      transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
      }}
        >
      <div className='popDiv'>
      <center><h4>{date}</h4></center>
      <Button  color="primary" aria-label="Add" onClick={(e)=> this.onAddClick(e,date)}>
          <AddIcon />
      </Button>
      <div style={formStyle}>
          <TextField
              id="event-name"
              label="Event Name"
              placeholder="Add Event Name"
              margin="normal"
              value = {this.state.name}
              onChange={(e)=>this.handleNameChange(e)}
          />
          <br/>
          <TextField
              id="eventTime"
              label="Time"
              type="time"
              //defaultValue="09:30"
              InputLabelProps={{
                  shrink: true,
              }}
              inputProps={{
                  step: 300, // 5 min
              }}
              value = {this.state.eventTime}
              onChange={(e)=>this.handleTimeChange(e)}
          />
          <div className='col'>
          <Button  variant="contained" color="primary" onClick ={()=>this.handleSubmit()}>
              Submit
          </Button>
          <Button  variant="contained" color="secondary" onClick={()=>this.handleClose()}>
              Cancel
          </Button>
          </div>
      </div>
      <div style={dispStyle}>
          {this.state.eventsArray.map((item, index) => {
              return (
                  <Card key={index} style={cardStyle}>
                      <CardContent>
                          <b>Event Name: </b> {item.name}
                          <br/>
                          <b>Time:</b> {item.time}
                          <br/>
                      </CardContent>
                      <CardActions >
                          <IconButton color="secondary" component="span" value={item.name} onClick={(value,e)=>this.handleDeleteClick(item.name,e)}>
                              <DeleteIcon/>
                          </IconButton>
                      </CardActions>
                  </Card>
              )
          })}
      </div>
      </div>
    </Popover>;
    }
    /*
    Render Cells for each date
    */
    renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
          formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={(e) => this.onDateClick(e,dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>


          </div>

        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}
        </div>;
    }
    /*
    On click function to Render Popup when a date is clicked
    */
    onDateClick(event,day) {
    this.setState({
    selectedDate: day,
    anchorEl: event.currentTarget,
    dispOrAdd:true,
    eventsArray:[]
    });
    };
    /*
    On click function when Add Event button is clicked
    */
    onAddClick(event,day){
    this.setState({
      dispOrAdd:false
    });
    }
    /*
    To Move to next Month
    */
    nextMonth = () => {
    this.setState({
    currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });

    };
    /*
    To Move to Previous Month
    */
    prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
    };
    /*
    On click Function when Submit Event is clicked
    */
    handleSubmit =() => {
    const item = this.state.eventsArray;
    const name  =  this.state.name;
    const time = this.state.eventTime;
    item.push({ name, time});
    this.setState({itemArray: item,
      dispOrAdd:true});

    };
    /*
    TO close Popover
    */
    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };
    /*
    On Change of Event Name event
    */
    handleNameChange(event) {
        this.setState({name: event.target.value});
    }
    /*
    On Change of Time event
    */
    handleTimeChange(event){
    this.setState({time:event.target.value});
    }
    /*
    When a event is deleted
     */
    handleDeleteClick(value,event){
      const item = this.state.eventsArray;
        const name  = value;
        const ind = item.findIndex(a => a.name === name);
        if (ind>-1){
            item.splice(ind,1);
        }
        this.setState({itemArray: item});
    }
    /*
    Main function to render all components
     */
    render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderPopOver()}
        {this.renderCells()}
      </div>
    );
    }
}

export default Calendar;
