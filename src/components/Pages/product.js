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
  FormControl
} from "../../includes";
import axios from 'axios'


import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import {addProduct,editProduct,purchaseProduct} from "../../actions/product-actions";
import Snackbar from "../Snackbar";
const apiURL = "http://localhost:3002/api"
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
    

class Product extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          Name:"",
          description:"",
          quantity:0,
          price:0,
          apiURL:"",
          username : localStorage.getItem("userlogin")
      }
      this.getData = this.getData.bind(this)
  }
  getData(Id){
    return axios.get(`${apiURL}/store/${Id}`,{headers : {"Content-Type":"application/json"}}).then(data => data).catch(err => err);
  }
  componentDidMount(){
    let paramsId = this.props.match.params.id ? this.props.match.params.id :"";
    console.log("paramsId",this.props.match.url.split("/")["1"])
    if(paramsId){
      const getData = this.getData(paramsId);
      getData.then(data =>{
        let dataResp = JSON.parse(data.data.response);
        this.setState({Name : dataResp.Name,
          price : dataResp.price,
          quantity : dataResp.quantity,
          description : dataResp.description,
          apiURL : this.props.match.url.split("/")["1"] ? this.props.match.url.split("/")["1"]: ""})
      }).catch(err =>{
        return err;
      })
    }
  }
  handleChange = name => event => {
    let dataAttr = this.state;
    dataAttr[name] = event.target.value
    console.log("dataAttr",dataAttr)
    this.setState(dataAttr)
  };
  onSubmit(event) {
    console.log("this.state",this.state)
    event.preventDefault();
    if(this.state.apiURL ===  "edit"){
      this.props.editNewProduct(this.state._id,this.state);
    }else if(this.state.apiURL ===  "order"){
      this.props.purchaseProduct(this.state);
    }else{
      this.props.addNewProduct(this.state);
    }
    this.redirectPage();
  }
  redirectPage = () =>{
    this.props.history.push("/dashboard");
  }
  render() {
    const { classes } = this.props;
    let title = "Add new product";
    let butTilte = "add new Product";
    let buttonCancel = "Reset";
    let disabled = false;
    if(this.state.apiURL){
      title =  this.state.apiURL ===  "edit" ? "Edit product" : "Purchase Product";
      butTilte =  this.state.apiURL ===  "edit" ? "Edit product" : "Purchase";
      buttonCancel =  this.state.apiURL ===  "order" ? "Cancel Order" : "Reset";
      disabled = this.state.apiURL  ===  "order" ? true:false;
      
    }    

    return (
        <React.Fragment>
        <Typography variant="display1" gutterBottom component="h2">
        Product
        <Snackbar {...this.props.alert} />
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
    <Typography variant="headline">{title}</Typography>
            <ValidatorForm
              className={classes.form}
              onSubmit={this.onSubmit.bind(this)}
              onError={errors => console.log(errors)}
            >
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Name"
                  validators={["required"]}
                  name="Name"
                  id="Name"
                  value={this.state.Name}
                  onChange={this.handleChange("Name")}
                  disabled = {disabled}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Quantity"
                  validators={["required"]}
                  name="quantity"
                  id="quantity"
                  value={this.state.quantity}
                  onChange={this.handleChange("quantity")}
                  disabled = {disabled}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Price"
                  name="price"
                  type="price"
                  validators={["required"]}
                  id="price"
                  value={this.state.price}
                  autoComplete="current-price"
                  onChange={this.handleChange("price")}
                  disabled = {disabled}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  disabled = {disabled}
                  label="Description"
                  name="description"
                  type="description"
                  validators={["required"]}
                  id="description"
                  value={this.state.description}
                  autoComplete="current-description"
                  onChange={this.handleChange("description")}
                />
              </FormControl>
              
              <Button
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                type="submit"
              >
               {butTilte}
              </Button>
              <Button  fullWidth  color="primary" variant="raised" type="button" onClick={this.redirectPage}>{buttonCancel}</Button>
            </ValidatorForm>
          </Paper>
        </main>
      </Typography>
      </React.Fragment>
      );
  }
}

Product.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
    addNewProduct: addProduct,
    editNewProduct:editProduct,
    purchaseProduct : purchaseProduct
};
const stylesLogin = withStyles(styles)(Product)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(stylesLogin);
