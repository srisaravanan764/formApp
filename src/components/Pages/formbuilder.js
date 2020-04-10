import React from 'react';
import { ReactFormBuilder, ElementStore } from 'react-form-builder2';
import { get, post } from './requests';

const getUrl = (cid) => `https://safe-springs-35306.herokuapp.com/api/formdata?cid=${cid}`;

class formBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formId: '1' };
    this.formId = this.state.formId;
    this.handleChange = this.handleChange.bind(this);
  }

  formId;

  handleChange(event) {
    this.formId = event.target.value;
    const url = getUrl(this.formId);
    console.log('handleChange', url);
    ElementStore.dispatch('load', { loadUrl: url });
    this.setState({ formId: this.formId });
  }

  onLoad = () => {
    const url = getUrl(this.formId);
    console.log('onLoad', url);
    return get(url);
  };

  onPost = (data) => {
    const saveUrl = getUrl(this.formId);
    console.log('onPost', saveUrl, data);
    post(saveUrl, data);
  };

  render() {
    return (
      <div className="App">
        <label>
          Select your form:          
        </label>
        <select className="form-control" 
            value={this.state.formId} 
            onChange={this.handleChange} >
          <option value="1">Form 1</option>
          <option value="2">Form 2</option>
        </select>
        <hr></hr>
        <ReactFormBuilder
          onLoad={this.onLoad}
          onPost={this.onPost}
        />,
      </div>
    );
  }
}