import axios from 'axios';
const storage = {
  token: "",
  userInfo: "userlogin",
  role : "role",
  userName: "srisaravanan764@gmail.com",
  password: "CG-vak123"
};
const apiURL = "http://localhost:3002/api/auth"
class User {
  setToken = token => {
    localStorage.setItem(storage.token, token);
  };
  getDataKey = key => {
    return localStorage.getItem(key);
  };
  setUserInfo = info => {
    localStorage.setItem(storage.userInfo, info);
  };
  setRole = role =>{
    localStorage.setItem(storage.role, role);
  }
  isLogin() {
    return localStorage.getItem(storage.token) &&
      localStorage.getItem(storage.userInfo)
      ? true
      : false;
  }
  isRegister() {
    return localStorage.getItem("reg") === "1"
      ? true
      : false;
  }

  loginAttempt = (username, password) => {
  return axios.post(`${apiURL}/login`, {username:username,password:password})
  .then( (response) => response)
  .catch(error => error );
  };
  userRegister = (userInfo) =>{
  return axios.post(`${apiURL}/register`, userInfo)
  .then( (response) => {
    localStorage.setItem("reg",1);
   return response.data
  })
  .catch(error => error );
  }
  clearData() {
    localStorage.removeItem(storage.token);
    localStorage.removeItem(storage.userInfo);
    localStorage.removeItem(storage.role)
  }
}
export default new User();
