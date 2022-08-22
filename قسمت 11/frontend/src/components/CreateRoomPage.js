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

export default class CreateRoomPage extends Component{

    defaultVotes=2;

    constructor(props) {
        super(props)
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };

        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuesteCanPauseChange = this.handleGuesteCanPauseChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        
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

    render() {
        return (
            <Grid container spacing={1} >
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                      ساخت اتاق
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="filedset">
                        <FormHelperText>
                            <div align="center">اجازه ی مهمانان برای پخش یا توقف اهنگ </div>
                        </FormHelperText>

                        <RadioGroup row defaultValue="true" onChange={this.handleGuesteCanPauseChange}>
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
                        defaultValue={this.defaultVotes}
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
}