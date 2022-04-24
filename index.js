const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" this mongodb");
});
// user name: mongodb1 password:fZM0J0UF9eAVNBb1

const uri =
  "mongodb+srv://mongodb1:fZM0J0UF9eAVNBb1@cluster0.1y8ap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");
    // const user ={ name: 'mahia mahi', email:'mahi@yahoo.com'};

    //Load data from backend & display in UI
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    //find a single user

    app.get('/user/:id', async(req,res)=>{
      const id= req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result)
    })
    // post data: Add user to backend
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("add new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //Update user

    app.put('/user/:id', async (req,res)=>{
      const id= req.params.id;
      const updateUser= req.body;
      const filter ={_id:ObjectId(id)}
      const options = {upsert:true};
      const updateDoc = {
        $set: {
          name:updateUser.name,
          email: updateUser.email
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    //delete a  user
    app.delete('/user/:id', async(req,res)=>{
      const id= req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)

    })
  } finally {
    //await client.close()
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Running react-mongo-curd");
});
