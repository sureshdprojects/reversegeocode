const express = require('express')
const app = express()
const port = 3000

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };


let dbUrl = 'mongodb+srv://suresh:FQKFfRX2yfMB8Zih@portfolio-suresh.6c5fu8m.mongodb.net/lifeisjoy?retryWrites=true&w=majority';
  
mongoose.connect(dbUrl, options);

let localitySchema = new Schema(
  {
    id: {
      type: Number
    },
    parentId: {
      type: Number
    },
    name: {
      type: String
    },
    pinCode: {
      type: String
    },
    lat:{
        type: Number
    },
    lon:{
        type: Number
    }
  }
);

let Locality = mongoose.model("localities", localitySchema);

app.get('/', async (req, res) => {
    
    let skip = 0;
    let limit = 50;
    let localities = []
    do{
        localities = await Locality.find().skip(skip).limit(limit)
        for(var i=0;i<localities.length;i++){
            let loc = localities[i];
            let url = "https://api.geoapify.com/v1/geocode/reverse?lat="+ loc.lat +'&lon=' + loc.lon + "&apiKey=d49e0d1b8f8c428bb0e36be17ab35b78";
            fetch(url)
            .then(response => response.json())
            .then(result => {
                if (result.features.length) {
                    let pin = result.features[0].properties.postcode
                    if(pin){
                        loc.pinCode = pin
                        loc.save();
                    }
                  } else {
                    console.log("No address found");
                  }
              });
        
        }
        skip+=limit;
    }while(localities.length == limit);

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})