import { IS_LOGIN, USER_NAME, USER_PASSWORD } from "./action-type";
import { pageLoading, alertError, alertSuccess } from "./alert-actions";
import User from "../tools/user-service";
export const userNameChange = username => {
  const type = USER_NAME;
  return { type, username };
};
export const userPasswordChange = password => {
  const type = USER_PASSWORD;
  return { type, password };
};
export const userLogin = (token, username) => {
  console.log("token",token)
  const type = IS_LOGIN;
  User.setToken(token.access_token ? token.access_token : Math.random());
  User.setUserInfo(username);
  User.setRole(token.role)
  return { type, token };
};

export const userClear = () => {
  const type = IS_LOGIN;
  User.clearData();
  return { type, token: null };
};

export const userLoginSubmit = (username, password) => {
  return dispatch => {
    dispatch(pageLoading());
    let loginResp = User.loginAttempt(username, password);
    loginResp.then(data =>{
      if(data.status === 200){
        dispatch(userLogin(data.data.response, username));
        return dispatch(
          alertSuccess("logged in successfully")
        );
      }else{
        return dispatch(alertError("username/password invalid"));
      }
    }).catch(err => {
      return dispatch(alertError("username/password invalid"));
    })
  };
};
export const userRegisterSubmit = (userInfo) => {
  return dispatch => {
    dispatch(pageLoading());
    if (User.userRegister(userInfo)) {
      return dispatch(
        alertSuccess("user registration successfully")
      );
    }
    return dispatch(alertError("Registration failed"));
  };
};
export const userLogout = () => {
  return dispatch => {
    /*dispatch(userPassword("1"));*/
    dispatch(alertSuccess("logout successfully"));
    dispatch(userClear());
  };
};
