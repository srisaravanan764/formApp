var formData = require('./formData');
function fixFormData(data,username) {
  if(!data || data === '[]' || data.length === 0) {
    return []
  }else{
    //const newData = data.map(v => ({...v, username: username}))
    return data
  }
}

exports.getFormdata = async (req, res) => {
    let data = "";
    let username = req.query.username;
    data = await formData.load(username);
    if(data && data.length > 0){
      formData.task_data = data[0]['data'];
      res.status(200).send(data[0]['data']);
    }else{
      data = []
      formData.task_data = []
      res.status(200).send(data);
    }
  }

exports.postFormData =async (req, res) => {
  try{
    formData.data.task_data = req.body.data;
    let username = req.query.username;
    const data = await fixFormData(formData.data.task_data,username);
    let formUserData =  await formData.save(data,username);
    console.log("formUserData --->",formUserData)
    res.status(200).send(data);
  }catch(err){
    res.status(304).send(data);
  }
  };