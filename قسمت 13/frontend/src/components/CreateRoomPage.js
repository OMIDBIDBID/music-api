import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component{

    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };

        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuesteCanPauseChange = this.handleGuesteCanPauseChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.renderCreateButtons = this.renderCreateButtons.bind(this);
        this.renderUpdateButtons = this.renderUpdateButtons.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
        
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }


    handleGuesteCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }


    handleRoomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),  
        };

        fetch("/api/create/room/", requestOptions).then((response) => response.json()).then((data) => this.props.history.push('/room/' + data.code));
    }


    handleUpdateButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,

            })
        }

        fetch("/api/update/room/", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg: "اطلاعات اتاق با موفقیت به روزرسانی شد"
                })
            } else {
                this.setState({
                    errorMsg: "اشکال در به روزرسانی اتاق!!!"
                })
            }
            this.props.updateCallback();
        })
    }


    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                   
                   <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                     ایجاد اتاق
                   </Button>
                     
                 </Grid>
 
                 <Grid item xs={12} align="center">
                    
                   <Button color="secondary" variant="contained" to="/" component={Link}>
                     بازگشت به صفحه اصلی
                   </Button>
                     
                 </Grid>
            </Grid>
        )
    }


    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                   
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
                        به روزرسانی اتاق
                </Button>
                     
            </Grid>
        )
    }

    render() {

        const title = this.props.update ? "به روزرسانی اتاق" : "ساخت اتاق";
        return (
            <Grid container spacing={1} >

                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != "" ? (
                            <Alert
                            severity="success"
                            onClose={() => {
                                this.setState({successMsg:""})
                            }}
                            >
                                {this.state.successMsg}
                            </Alert>
                        ) : (
                            <Alert
                            severity="error"
                            onClose={() => {
                                this.setState({errorMsg: ""})
                            }}
                            >
                                {this.state.errorMsg}
                            </Alert>
                        
                        )}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                      {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="filedset">
                        <FormHelperText>
                            <div align="center">اجازه ی مهمانان برای پخش یا توقف اهنگ </div>
                        </FormHelperText>

                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuesteCanPauseChange}>
                            <FormControlLabel value="true" control={<Radio color="primary" />}
                            label="اجازه پخش/توقف دارد"
                            labelPlacement="bottom"></FormControlLabel>

                       
                            <FormControlLabel value="false" control={<Radio color="secondary" />}
                            label="اجازه ندارد"
                            labelPlacement="bottom"></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                    
                </Grid>


                <Grid item xs={12} align="center">
                   
                  <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votesToSkip}
                        inputProps={{
                            min:1 ,
                            style: { textAlign: 'center'},
                        }}>

                    </TextField>
                    <FormHelperText>
                        <div align="center"> تعداد رای مورد نیاز برای رفتن به اهنگ بعدی</div>
                    </FormHelperText>
                  </FormControl>
                    
                </Grid>
                        {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
                
            </Grid>
        )
    }
}