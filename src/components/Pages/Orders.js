import React, { Component } from "react";
import axios from 'axios'
import { connect } from "react-redux";
import { Typography } from "../../includes"
import PropTypes from "prop-types";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import {purchaseProduct} from "../../actions/product-actions";
const apiURL = "http://localhost:3002/api"
class Orders extends Component {
  constructor(props){
    super(props)
    this.state = {
      Name:"",
      description:"",
      quantity:0,
      price:0,
      _id:""
  }
    this.getData = this.getData.bind(this)
  }
  getData(Id){
    return axios.get(`${apiURL}/store/${Id}`,{headers : {"Content-Type":"application/json"}}).then(data => data).catch(err => err);
  }
  componentDidMount(){
    let paramsId = this.props.match.params.id ? this.props.match.params.id :"";
    console.log("data.data.response",paramsId)
   
    if(paramsId){
      const getData = this.getData(paramsId);
      getData.then(data =>{
        let dataResp = JSON.parse(data.data.response);
        console.log("data.data.response")
        this.setState({Name : dataResp.Name,
          price : dataResp.price,
          quantity : dataResp.quantity,
          description : dataResp.description})
      }).catch(err =>{
        return err;
      })
    }
  }
  purchaseProduct(){
    
  }
  purchaseProductCancel(){
    this.props.history.push(`/dashborad`);
  }
  render() {
    const productList = this.props.product.purchaseProduct
    return (
        <div>
            <Typography variant="h4" style={style}>Product Details</Typography>
            <Button variant="contained" color="primary" onClick={() => this.purchaseProduct.bind(this)}>
                Purchase
            </Button>
            <Button variant="contained" color="primary" onClick={() => this.purchaseProductCancel.bind(this)}>
                Cancel
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody> 
                    {productList.map((row,i) => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {i}
                            </TableCell>
                            <TableCell align="right">{row.Name}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.description}</TableCell>
                            <TableCell align="right">{row.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
  }
}

Orders.propTypes = {
  classes: PropTypes.object.isRequired
};

const style ={
  display: 'flex',
  justifyContent: 'center'
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
    purchaseProduct: purchaseProduct
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
