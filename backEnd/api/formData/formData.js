const formData = require('./formData.json');
const formModel = require('./form.model') 
// var db;

// MongoClient.connect(MONGO_URL, (err, client) => {
//     console.log('Connected successfully to server', `${MONGO_URL}/${dbName}`);
//     db = client.db(dbName);
// });
async function saveFormData(doc,username) {
  try{
    let docData = JSON.stringify(doc);
    let respData = await dataInsertOrUpdate(username,docData);
    return respData
  }catch(err){
    return err
  }
}
const dataInsertOrUpdate = (username,docData) =>{
  return new Promise((resolve,reject) =>{
    let docCondition = { username: { $regex:username.toLowerCase(), $options: "i" } };
    console.log(docCondition);
    let formLengthData = formModel.findOne(docCondition).select({_id:1,username:1}).exec()
    formLengthData.then( data  => {
      if(data){
        formModel.findByIdAndUpdate({_id: data._id}, {username : username,data : docData},{upsert:false,new:true},(err,data) =>{
          if(err){
            reject(err)
          }
          resolve(data);
        })
      }else{
        const newForms = formModel({username : username,data : docData})
        newForms.save((err,data) =>{
          if(err){
            reject(err)
          }
          resolve(data);
        })
      }
    }).catch(err =>{
      reject(err)
    })
  })
}
async function loadFormData(username) {
  let docCondition = { username: { $regex:username.toLowerCase(), $options: "i" } };
  console.log("docCondition",docCondition)
  return formModel.find(docCondition).exec();
}

async function deleteFormData(doc) {
  formModel.deleteOne({ id: doc.id });
}

function findRemovedItem(currentArray, previousArray) {
  return previousArray.filter(x => {
    const z = currentArray.find(y => y.id === x.id);
    return !currentArray.includes(z);
  });
}

async function save(taskData,username) {
  try{
    const response  =  await saveFormData(taskData,username);
    return response;
  }catch(err){
    return err
  }
}

module.exports = {
  data: formData,
  answers: {},
  save,
  load: loadFormData,
};