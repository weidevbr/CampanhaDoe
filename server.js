const express = require("express");
const server = express();

//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'));

//habilitar body do formulario
server.use(express.urlencoded({extended:true}));

//configurar banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user:"postgres",
    password:"123456",
    host:'localhost',
    por:5432,
    database:'doe'
});

//configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./",{
    express: server,
    noCache:true
});

//configura apresentacao da pagina
server.get("/",function(req,res){
    
    db.query("SELECT * FROM donors", function(err,result){
        if(err) return res.send("Erro no banco de dados.")
        const donors = result.rows;
        return res.render("index.html",{donors});

    });
});

server.post("/", function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email =="" || blood==""){
        return res.send("Todos os campos são obrigatórios")
    };

    //coloca valores no Banco de Dados
    const query = 
        `INSERT INTO donors ("name","email","blood") 
         VALUES($1,$2,$3)`

         const values = [name,email,blood]

    db.query(query,values,function(err){
        
        if(err) return res.send("erro no banco de dados.")
      
        return res.redirect("/") 
    });  
});

// ligar o servidor e permitir acesso na porta 3000
server.listen(3000,function(){
    console.log("Iniciei servidor")
});