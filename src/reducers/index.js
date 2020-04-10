import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import alertReducer from "./alert-reducer";
import dashboardReducer from "./dashboard-reducer";
import  productReducer from "./product-reducers";
export default combineReducers({
  login: userReducer,
  alert: alertReducer,
  dashboard: dashboardReducer,
  product : productReducer
});
