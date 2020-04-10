import React from 'react';
import PropTypes from "prop-types";
import {
  withStyles,
  CssBaseline,
  Button,
  Paper,
  Avatar,
  LockIcon,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  User
} from "../includes";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import {
    userRegisterSubmit 
} from "../includes/actions";
import Snackbar from "./Snackbar";
const styles = theme => ({
    layout: {
      width: "auto",
      display: "block", // Fix IE11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 3}px`
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE11 issue.
      marginTop: theme.spacing.unit
    },
    submit: {
      marginTop: theme.spacing.unit * 3
    }
  });
    

class Register extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          username:"",
          password:"",
          role:"",
          name:""
      }
  }
  isRegister() {
    if (User.isRegister()) {
      localStorage.removeItem("reg");
      this.props.history.push("/");
    }
  }
  componentDidUpdate() {
    this.isRegister();
  }
  componentWillMount() {
    this.isRegister();
  }
  handleChange = name => event => {
    let dataAttr = this.state;
    dataAttr[name] = event.target.value
    console.log("dataAttr",dataAttr)
    this.setState(dataAttr)
  };
  onSubmit(event) {
    event.preventDefault();
    console.log("this.state",this.state)
    this.props.userRegisterationSubmit(this.state);
  }

  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
        <Snackbar {...this.props.alert} />
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="headline">Register User</Typography>
            <ValidatorForm
              className={classes.form}
              onSubmit={this.onSubmit.bind(this)}
              onError={errors => console.log(errors)}
            >
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Name"
                  validators={["required"]}
                  name="name"
                  id="name"
                  value={this.state.name}
                  errorMessages={["invalid name"]}
                  onChange={this.handleChange("name")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Email"
                  validators={["required"]}
                  name="username"
                  id="username"
                  type="email"
                  value={this.state.username}
                  errorMessages={["invalid email address"]}
                  onChange={this.handleChange("username")}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="password"
                  name="password"
                  type="password"
                  validators={["required"]}
                  errorMessages={["Invalid password"]}
                  id="password"
                  value={this.state.password}
                  autoComplete="current-password"
                  onChange={this.handleChange("password")}
                />
              </FormControl>
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="role" value={this.state.role} onChange={this.handleChange('role')}>
                    <FormControlLabel value="admin" control={<Radio />} label="admin" />
                    <FormControlLabel value="user" control={<Radio />} label="user" />
                </RadioGroup>
              </FormControl>
              <Button
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                type="submit"
              >
                Register
              </Button>
            </ValidatorForm>
          </Paper>
        </main>
      </React.Fragment>
      );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
    userRegisterationSubmit: userRegisterSubmit
};
const stylesLogin = withStyles(styles)(Register);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(stylesLogin);
