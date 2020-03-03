var Realm = require('realm');
var constants = require('./constants');


busSchema = {
  name: 'bus',
  properties: {
    make: 'string',
    model: 'string',
    miles: 'int'
  }
}

carSchema = {
  name: 'car',
  properties: {
    name: 'string'
  }
}



const errorCallback = function errorCallback(message, isFatal) {
  console.log(`Message:`, message, `- isFatal:`, isFatal)
}


async function main() {

  const credentials = Realm.Sync.Credentials.usernamePassword(constants.username, constants.password, false);
  const adminUser = await Realm.Sync.User.login(constants.httpUrl, credentials);
  Realm.open({
    schema: [busSchema, carSchema],
    sync: {
      user: adminUser,
      url: `${constants.realmUrl}/latency_test`,
      fullSynchronization:true,
      // The behavior to use when this is the first time opening a realm.
      newRealmFileBehavior: {
        type: "openImmediately"
      },
      // The behavior to use when a realm file already exists locally,
      // i.e. you have previously opened the realm.
      existingRealmFileBehavior: {
        type: "openImmediately"
      },

      error: errorCallback,
    }
  }).then(realm => {
    console.log('writing...')

    try{
    realm.write(() => {
      realm.create('car', {
        name: 'mustang',
      });
    })
    console.log(`wrote the data`);
  }catch(err){
    console.log(err);
  }

    let results = realm.objects('car')
    results.addListener((objects, changes) => {
      console.log(objects);
    });

    // realm.close();

  }).catch(error => {
    console.log(`error while writing : `, error);
  })
}

main();