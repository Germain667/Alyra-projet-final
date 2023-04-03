const express = require('express')
const fs = require('fs')
const multer = require('multer')
const cors = require('cors');
const upload = multer({ dest: 'images/' })
const app = express()


require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(key, secret);
const prefixPinata = "https://gateway.pinata.cloud/ipfs/";



// Utilise le middleware cors
app.use(cors({ origin: 'http://localhost:8080' }));


// app.use('/images', express.static('images'))
app.get('/images/:imageName', (req, res) => {
  // do a bunch of if statements to make sure the user is 
  // authorized to view this image, then

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`images/${imageName}`)
  readStream.pipe(res)
})

app.post('/images', upload.single('image'), (req, res) => {
  
    //nouveau nom du fichier : 
    const imageName = req.file.filename
    //ancien nom du fichier : 
    const fileName = req.body.fileName

    const readableStreamForFile = fs.createReadStream("images/"+imageName);

    const options = {
        pinataMetadata: {
            name: "BlockCar NFT",
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        body = {
            //description: "Description du NFT",
            image: result.IpfsHash,
            name: "BlockCar document",
        };

        //console.log("result.IpfsHash : ",result.IpfsHash);
        //console.log("prefixPinata : ",prefixPinata);
    
        const CID = result.IpfsHash;
        const entireURI = prefixPinata.concat(CID);
    
        //console.log("CID: ",CID);
        //console.log("entireURI: ",entireURI);

        res.send({imageName, entireURI})


        pinata.pinJSONToIPFS(body, options).then((json) => {
            console.log(json);
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
    });

  
    //console.log("imageName : ",imageName);
    //console.log("fileName : ",fileName);


    
})

app.listen(8082, () => console.log("listening on port 8082"))