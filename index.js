const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const database = require("mysql")

const connect=express()
connect.use(cors())
connect.use(bodyparser.json())
connect.use(express.json())
connect.use(express.static('public'))
connect.use(bodyparser.urlencoded({extended:true}))

let databaseconnection = database.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "9092815611",
    database: "moodle_task"
})
databaseconnection.connect(function(error){
    if(error){
        console.log(error)
    }
    else{
        console.log("database is connected")
    }
})

connect.get('/getdata',(request,response)=>{
    let sql = 'select * from emp'
    databaseconnection.query(sql,(error,result)=>{
        if(error){
            response.send(error)
            console.log(error)
        }
        else{
            response.send(result)
        }
    })
})

connect.get('/getsingle/:id',(request,response) =>{
    let {id} = request.params
    let sql='select * from form where id=?'
    databaseconnection.query(sql,[id],(error,result) => {
        if(error){
            response.send(error)
            console.log(error)
        }
        else{
            response.send(result)
        }

    })
}) 

connect.post('/delete',(request,response)=>{
    let empno=request.body.empno
    let sql='delete from emp where empno=?'
    databaseconnection.query(sql,[empno],(error,result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else{
            response.send({"status":"success"})
        }
    })
})

connect.post('/register',(request,response)=>{
    let {fName,lName,email,phone,city,state,password} =request.body
    let sql= 'insert into form (fName,lName,phone,email,city,state,username,password)values(?,?,?,?,?,?,?,?)'
    databaseconnection.query(sql,[fName,lName,phone,email,city,state,email,password],(error,result)=>{
        if (error) {
            response.send({"status":"error"})
            console.log(error)
        }
        else{
            response.send({"status":"success"})
        }
    })
})

connect.post('/login',(request,response)=>{
    let {username,password}=request.body
    let sql='select * from form where username=?'
    databaseconnection.query(sql,[username],(error,result)=>{
        if(error){
            response.send({"status":"empty_set"})
        }
        else if(result.length>0){
            let dbusername=result[0].username
            let dbpassword=result[0].password
            let id=result[0].id
            if(dbusername===username && dbpassword===password){
                response.send({"status":"success","id":id})
            }
            else{
                response.send({"status":"invalid_user"})
            }
        }
        else{
            response.send({"status":"error"})
        }
    })
})

connect.put('/update/:id',(request,response)=>{
    let{id} =request.params
    let {fName,lName,phone,email,city,state,password}=request.body
    let sql='update form set fName=?,lName=?,phone=?,email=?,city=?,state=?,password=? where id=?'
    databaseconnection.query(sql,[fName,lName,phone,email,city,state,password,id],(error,result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else{
            response.send({"status":"success"})
        }
    })
})
connect.listen(3002,()=>{
    console.log("your server is running in port 3002")
})
