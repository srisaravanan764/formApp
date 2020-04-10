import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Typography } from "../../includes";
import FormBuilder from 'react-form-builder2';
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import {withStyles,FormControl,Button } from "../../includes";
import { ReactFormBuilder , ReactFormGenerator, ElementStore } from 'react-form-builder2';

const styles = withStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

class Dashboard extends Component {
  
    constructor(props){
      super(props)
      this.state = {
        data : [],userData:[],
        refresh:false,
        previewVisible: false,
        shortPreviewVisible: false,
        roPreviewVisible: false,
        name :"",username : localStorage.getItem("userlogin")
    }
    const update = this._onChange.bind(this);
    ElementStore.subscribe(state => update(state));
  }
  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  showShortPreview() {
    this.setState({
      shortPreviewVisible: true,
    });
  }
  showRoPreview() {
    this.setState({
      roPreviewVisible: true,
    });
  }

  closePreview() {
    this.setState({
      previewVisible: false,
      shortPreviewVisible: false,
      roPreviewVisible: false,
    });
  }

  _onChange(data) {
    this.setState({
      data : data.data,
      username:data.username
    });
  }
  refreshPage(){
    var self  =  this;
    var username = localStorage.getItem("userlogin");
    var apiFormURL = "http://localhost:3002/api/forms?username="+username;
    console.log("refresh user",username)
    axios.get(`${apiFormURL}`)
    .then( response =>{
      let refresh = response.data.length > 0 ? true:false;
     self.setState({
        data : [...response.data],
        refresh : refresh
      })
    })
    .catch(error => {
      console.log("resp error ==>",error)
    });
  }
  onSubmit(data) {
    var data = this.state.data;
    var username = this.state.username ? this.state.username : localStorage.getItem("userlogin")
    var apiFormURL = "http://localhost:3002/api/forms";
    var postURL = apiFormURL+"/formData?username="+username;
    console.log('onSubmit postURL', postURL);
    console.log('username', username);
    axios.post(`${postURL}`,{data:data})
      .then( response =>{
        console.log('onSubmit response', response.data);
        this.setState({
          data : [...response.data.response]
        })
      })
      .catch(error => {
        console.log("resp error ==>",error)
      });
  }
  componentWillMount(){
    let apiURL = "http://localhost:3002/api/customer/";
    axios.get(`${apiURL}`)
      .then( response =>{
        this.setState({
          userData : [...response.data.response.customers]
        })
      })
      .catch(error => {
        console.log("resp error ==>",error)
      });
  }
  handleChange(event){
    let dataAttr = this.state;
    dataAttr[event.target.name] = event.target.value
    this.setState(dataAttr)
  }
  render() {
    const { classes } = this.props;
    let username = this.state.username ? this.state.username : localStorage.getItem("userlogin"); 
    console.log("username",username)
    var apiFormURL = "http://localhost:3002/api/forms";
    var getURL = apiFormURL+"?username="+this.state.username;
    var postURL = apiFormURL+"/formData?username="+this.state.username;
    let role = localStorage.getItem("role") ? localStorage.getItem("role") : "admin";  
    var userData = this.state.data

     console.log('userData',userData)
    let display = role === "admin" ? "none" : "block";

    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show';
    }

    let shortModalClass = 'modal short-modal';
    if (this.state.shortPreviewVisible) {
      shortModalClass += ' show';
    }

    let roModalClass = 'modal ro-modal';
    if (this.state.roPreviewVisible) {
      roModalClass += ' show';
    }

    return (
      <Typography contained="display1" gutterBottom component="h2">
        {role=== "admin" ? 
              <React.Fragment>
              <FormControl>
              <div className="clearfix" style={{ margin: '10px', width: '70%' }}>
        <h4 className="pull-left">Preview</h4>
        <button className="btn btn-primary pull-right" style={{ marginRight: '10px' }} onClick={this.showPreview.bind(this)}>Preview Form</button>
        <button className="btn btn-default pull-right" style={{ marginRight: '10px' }} onClick={this.showShortPreview.bind(this)}>Alternate/Short Form</button>
        <button className="btn btn-default pull-right" style={{ marginRight: '10px' }} onClick={this.showRoPreview.bind(this)}>Read Only Form</button>

        { this.state.previewVisible &&
          <div className={modalClass}>
            <div className="modal-dialog">
              <div className="modal-content">
                <ReactFormGenerator
                  download_path=""
                  back_action="/"
                  back_name="Back"
                  answer_data={{}}
                  action_name="Save"
                  form_action="/"
                  form_method="POST"
                  onSubmit={this.onSubmit.bind(this)}
                  variables={this.props.variables}
                  data={this.state.data} />

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        }

        { this.state.roPreviewVisible &&
          <div className={roModalClass}>
            <div className="modal-dialog">
              <div className="modal-content">
                <ReactFormGenerator
                  download_path=""
                  back_action="/"
                  back_name="Back"
                  answer_data={{}}
                  action_name="Save"
                  form_action="/"
                  form_method="POST"
                  read_only={true}
                  variables={this.props.variables}
                  hide_actions={true} data={this.state.data} />

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        }

        { this.state.shortPreviewVisible &&
          <div className={shortModalClass}>
            <div className="modal-dialog">
              <div className="modal-content">
                <ReactFormGenerator
                  download_path=""
                  back_action=""
                  answer_data={{}}
                  form_action="/"
                  form_method="POST"
                  data={this.state.data}
                  display_short={true}
                  variables={this.props.variables}
                  hide_actions={false} />

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
   
              </FormControl>
              <FormControl className={classes.formControl} display={display}>
              <NativeSelect
                className={classes.selectEmpty}
                value={this.state.username ? this.state.username : localStorage.getItem("userlogin")}
                name="username"
                onChange={this.handleChange.bind(this)}
                inputProps={{ 'aria-label': 'Name' }}
                required
              >
              <option value="test" disabled>Please select a user </option>
                {this.state.userData.length > 0 &&  this.state.userData.map((option, i) => {
                    return <option key={i} value={option.username}>{option.name}</option>
                })}
              </NativeSelect>
            <FormHelperText>Please select a user</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} display={display}>
              <ReactFormBuilder read_only={true}
              action_name="Save"
              form_method="POST" form_action={this.onSubmit.bind(this)} 
              url= {getURL}  saveUrl={postURL} />
            </FormControl>x
            </React.Fragment>
       : <React.Fragment>
            <button onClick={this.refreshPage.bind(this)} >Refresh </button>
            <FormBuilder.ReactFormBuilder
                url={getURL}
                toolbarItems={userData}
                 />
       </React.Fragment> }
    </Typography>
    );
    
  }
} 

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {};
const stylesLogin = withStyles(styles)(Dashboard)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(stylesLogin);
