require('dotenv').config();
const axios = require("axios");
const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

let connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: ""
})

async function Message(number, key, msg) {
    if(number.trim()!=''){
        const menssage = msg
        
        connection.query(`SELECT * FROM tb_gerar_token WHERE NAME_SESSION = ${key}`, 
        function(error, result) { 
            axios.post(``,
              {
                "phone": `${number}`,
                "isGroup": false,
                "message" : menssage
              },{
                headers: {
                  'authorization': `bearer ${result[0].TOKEN_VALIDO}`,
                }
              }).then(function(response){
                console.log(response)
                return true
              }).catch(function(error){
                console.log(error.response)
                return error.data.error
              });
        })

    }
}

app.use('/wp-hook', (req, res, next) => {
    
    let dataAtual = new Date();
    const event = req.body.event;
    let datasEnvio = {
        telefone: req.body.from.split("@")[0],
        instancia: 00,
        dateAtual: dataAtual,
        direcao: ["enviando", "recebendo"],
        tipo: ["inicial", "meio", "fim"],
        nameClient: req.body.notifyName,
        espero: ["resposta1", "resposta2", "resposta3", "resposta4", "resposta5", "cvsfinalizada"],
        iniciadoBy: ["cliente", "auto"]
    }

    if(event == "onmessage")
    {
        connection.query(
            `SELECT * FROM tb_conversas WHERE telefone = "${datasEnvio.telefone}" AND tipo != "fim" AND espero != "cvsfinalizada" ORDER BY id DESC LIMIT 1`,
            function(err, result){
                if(result.length > 0){
                    switch(result[0].instancia) {
                        case "14":
                            if(Message(result[0].telefone, req.body.session, "TESTE DA API VIA WHATSAPP"))
                            {
                                connection.query(
                                    `
                                    INSERT INTO tb_conversas(telefone, enviado_para, pon, instancia, msg, data, direcao, tipo, nome, espero, iniciado_por, hash_atendimento)
                                    VALUES
                                    (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
                                    [datasEnvio.telefone, req.body.from, result[0].pon, result[0].instancia, mensagem, datasEnvio.dateAtual, datasEnvio.direcao[0], datasEnvio.tipo[0], req.body.notifyName, datasEnvio.espero[0], result[0].iniciado_por, result[0].hash_atendimento])
                            }
                            break;
                        case "16":
                            if(Message(result[0].telefone, result[0].instancia, "TESTE DA API VIA WHATSAPP"))
                            {
                                // console.log(result)
                            }
                            break;
                        case "17":
                            if(Message(result[0].telefone, result[0].instancia, "TESTE DA API VIA WHATSAPP"))
                            {
                                // console.log(result)
                            }
                            break;
                        case "18":
                            if(Message(result[0].telefone, result[0].instancia, "TESTE DA API VIA WHATSAPP"))
                            {
                                // console.log(result)
                            }
                            break;
                        case "00":
                            if(Message(result[0].telefone, result[0].instancia, "TESTE DA API VIA WHATSAPP"))
                            {
                                // console.log(result)
                            }
                            break;
                        default:
                            console.log("Instância incorreta!")
                            break;
                    }
                }
                else
                {
                    // Message(datasEnvio.telefone, req.body.session, "ENVIANDO MENSAGEM ATRÁVES DA NOVA API!");
                }
            }
        );
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server started " + process.env.PORT);
})