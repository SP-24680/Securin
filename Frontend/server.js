const express=require("express");
const mysql=require("mysql2");
const fs=require("fs");
const cors=require("cors");
const xml2js=require("xml2js");
const app=express();
app.use(cors());
app.use(express.json());

const db=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"swetha@mysql$2005",
        database:"Securin"
    }
);
db.connect(err=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Connected to mysql");
    }
});

const xmlData=fs.readFileSync("official-cpe-dictionary_v2.xml","utf-8");
xml2js.parseString(xmlData,(err,result)=>{
    if(err) {
        console.log(err)
        }

    const data=result.cpe-list.cpe-item;
    data.forEach((item)=>{
        const query="INSERT INTO securindetails (cpe_title,cpe_22_uri,cpe_23_uri,reference_links,cpe_22_deprecation_date,cpe_23_deprecation_date) VALUES (?,?,?,?,?,?)";

    db.query(query,[item.cpe_title[0],item.cpe_22_uri[0],item.cpe_23_uri[0],item.reference_links[0],item.cpe_22_deprecation_date[0],item.cpe_23_deprecation_date[0]],err=>{
        if(err) console.log(err);
        else{
            console.log("data stored successfully in DBMS");
        }
    });
    });
});


app.get("/api/cpes",(req,res)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||5;
    const offset=(page-1)*limit;

    const query="SELECT * FROM securindetails LIMIT ? OFFSET ? ";
    db.query(query,[limit,offset], (err,result)=>{
        if(err) throw err;
        res.json(result)
    })
});

app.listen(3000,()=>{
    console.log("server running on port 3000");
});



