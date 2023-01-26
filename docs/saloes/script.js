
var saloes = []
window.onload = getSaloes(); 
function getSaloes(){
    
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    fetch("http://localhost:8080/api/companys/all", requestOptions)
    .then(response => response.text())
    .then(result => {saloes = JSON.parse(result)[0].json})
    .catch(error => console.log('error', error));
    setTimeout(() => {
        converteJson()
    }, 200);
   
}

function converteJson(){
    if (saloes.length > 0) {
        carregarpagina(JSON.parse(saloes.replaceAll("'", "")))
        saloes = JSON.parse(saloes.replaceAll("'", ""))
        exibesaloes()
    }
    else {
        converteJson()
    }
}
function carregarpagina(saloes){ 
    if(window.location.href.includes("#")){
        let regiao = window.location.hash.replace("#", "")
        setTimeout(() => {
            if (regiao == "congonhas") {
                document.getElementById("regiaofiltro").innerText = "Filtrado pela região de Congonhas"
            }
            if (regiao == "conselheirolafaiete") {
                document.getElementById("regiaofiltro").innerText = "Filtrado pela região de Conselheiro Lafaiete"
            }
            if (regiao == "ourobranco") {
                document.getElementById("regiaofiltro").innerText = "Filtrado pela região de Ouro Branco"
            }
        }, 100);
        for (var i=0; i< saloes.saloes.length; i++){
            if (saloes.saloes[i].regiao==regiao){
                html(saloes.saloes[i], i)}
           
        }
    }
    else{
        for (var i = 0; i < saloes.saloes.length; i++) {
            html(saloes.saloes[i], i)
        }
    }
}
function html(salao, id){
    
    let image = salao.image
    let name=salao.name
    let endereco=salao.endereco
    let telefone=salao.telefone
    let tipo = salao.tipo
    let htmltext = `
     <div class="salao">
                <div class="infomacoes">
                <p class="tiposalao">${tipo}</p>
                    <img
                        src="${image}"/>
                    <p class="titulosalao">${name}</p>
                    <p class="enderecosalao">${endereco}</p>
                    <p class="telefonesalao">${telefone}</p>

                </div>
                <div class="horarios" id="horarios_${id}">
                    
                </div>
            </div>
    `
    setTimeout(() => {
        document.getElementById("saloes").insertAdjacentHTML("beforeend", htmltext)
       
        for (var i = 0; i < salao.horarios.length;i++){
            let hour = salao.horarios[i]
            let htmlhorario = `
                <div class="servicoselect">
                <p>${hour.dia} - ${hour.horario}</p>
                <div style="display:flex;     align-items: center;
    justify-content: space-between;">${hour.nome} <p>${hour.valor}<i class="fa fa-calendar-plus-o" aria-hidden="true" style="font-size:25px; margin-left:15px; cursor:pointer;" onclick="add('${name}','${i}')"></i></p> </div>
                </div>
                `
            document.getElementById(`horarios_${id}`).insertAdjacentHTML("beforeend", htmlhorario)
        }
    }, 100);
    
}

function add(name,
servico_id){
    const token = window.localStorage.getItem("token")
    if (!token){
        window.location.href="/jubba-app/login"
    }
   else{
        
        var servico_obj={}
        var salao = saloes.saloes.filter(function (obj) { return obj.name == name; })[0]
        servico_obj.servico = salao.horarios[servico_id]
        salao.horarios.pop(servico_id)
        id = window.localStorage.getItem("token").split("_")[1]
        servico_obj.store=name
        servico_obj.endereco=salao.endereco
        servico_obj.telefone=salao.telefone
        servico=servico_obj.servico.nome
        dia=servico_obj.servico.dia
        horario = servico_obj.servico.horario
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "json": JSON.stringify(servico_obj),
            "idCliente": id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/companys/schedule-create", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(saloes);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/companys/edit-companys", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    exibeloading(`Enviando atualização para o estabelecimento - ${salao.name}`)
                    sendEmail(salao.email, salao.name, servico, dia, horario)
                } else {
                    alert("Algo deu errado!")
                }
            })
            .catch(error => console.log('error', error));

   }
}

function sendEmail(email, store, nome, dia, hora){
    cliente = window.localStorage.getItem("token").split("_")[0]
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email,
        "servico": `Olá ${store}, recebemos um agendamento de ${nome} no dia ${dia} as ${hora}, cliente: ${cliente}.`,
        "assunto": "Obá, um novo agendamento!"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/api/companys/notice-companys", requestOptions)
        .then(response => response.text())
        .then(result => window.location.reload())
        .catch(error => console.log('error', error));
}
function exibeloading(infoloading) {
    if (infoloading) {
        document.getElementById("infoloading").innerText = infoloading
    }
    document.getElementById("loading").style.display = "flex"
    document.getElementById("saloes").style.display = "none"
}
function exibesaloes() {
    document.getElementById("loading").style.display = "none"
    document.getElementById("saloes").style.display = "flex"
}
