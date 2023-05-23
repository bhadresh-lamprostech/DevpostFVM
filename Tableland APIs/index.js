const { Database } = require("@tableland/sdk");
const { Wallet, getDefaultProvider } = require("ethers");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")

dotenv.config();
const app = express();
const port = 3001;
app.use(bodyParser.json());


const privateKey = process.env.PRIVATE_KEY;
const wallet = new Wallet(privateKey);

// To avoid connecting to the browser wallet (locally, port 8545),
// replace the URL with a provider like Alchemy, Infura, Etherscan, etc.
const provider = getDefaultProvider("https://matic-mumbai.chainstacklabs.com"); // Update with your desired provider URL
const signer = wallet.connect(provider);

// console.log(JSON.stringify(provider));


// Connect to the database
const db = new Database({ signer });

// This is the table's `prefix`--a custom table value prefixed as part of the table's name
const prefix = "useronboard_80001_6237";
const files = "userfiles_80001_6243"

app.get("/create", async (req, res) => {
  try {
    const { meta: create } = await db
      .prepare(`CREATE TABLE ${prefix} (id integer primary key, filecid text, address text );`)
      .run();
    res.json({ tableName: create.txn.name });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  



app.post("/insert", async (req, res) => {
    try {
      const { meta: insert } = await db
        .prepare(`INSERT INTO ${prefix} (id, name, address, email, logocid) VALUES (?, ?, ?, ?, ?);`)
        .bind(req.body.id, req.body.name, req.body.address, req.body.email, req.body.logocid)
        .run();
  
      
      await insert.txn.wait();

   
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error inserting row:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Read all rows from the table
  app.get("/read", async (req, res) => {

    let address = req.body.address

    console.log(address)
    try {
      const { results } = await db.prepare(`SELECT * FROM ${prefix} WHERE address = "${address}"`).all();
    //   const { results } = await db.prepare(`SELECT * FROM ${prefix}`).all();
      console.log(JSON.stringify(results))
      res.json(results);
      
    } catch (error) {
      console.error("Error reading rows:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // Insert a row into the table
app.post("/insertimage", async (req, res) => {
  try {
    const { meta: insert } = await db
      .prepare(`INSERT INTO ${files} (id, filecid, address) VALUES (?, ?, ?);`)
      .bind(req.body.id, req.body.filecid, req.body.address)
      .run();

    await insert.txn.wait();

    res.json({ success: true });
  } catch (error) {
    console.error("Error inserting row:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read rows from the table
app.get("/readimage", async (req, res) => {
  let address = req.body.address;

  try {
    const { results } = await db
      .prepare(`SELECT * FROM ${files} WHERE address = "${address}"`).all();

    res.json(results);
  } catch (error) {
    console.error("Error reading rows:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
  