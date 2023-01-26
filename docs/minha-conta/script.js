window.addEventListener("load", function () {
    var token = window.localStorage.getItem("token")
    if (token != null) {
        setTimeout(() => {
            document.querySelector("body").style.display = ""
            hasts()
            if (window.location.hash == "#detalhes") {
            detalhes()}
            if (window.location.hash == "#agendamentos") {
                agendamentos()
            }
        }, 100);
        
    }
    else {
        window.location.href = "/jubba-app"
    }
});

function hasts(){
    exibesaloes()
    document.getElementById("semage").style.display = "none"
    hastsNone()
    if (window.location.hash == "#detalhes") {
        document.getElementById("detalhes").style.display = "flex"
    }
    if (window.location.hash == "#agendamentos") {
        document.getElementById("agendamentos").style.display = "flex"
    }
}
function hastsNone(){
    document.getElementById("detalhes").style.display = "none"
    document.getElementById("agendamentos").style.display = "none"
}
function exit(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', '*')
    myHeaders.append('Access-Control-Allow-Methods', 'POSTS')
    myHeaders.append('Access-Control-Request-Method', '*')
    myHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    var raw = JSON.stringify({
        "username": window.localStorage.getItem("token").split("_")[0]
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/api/auth/signout", requestOptions)
        .then(response => {
            if (response.status == 200) {
                window.localStorage.removeItem("token"); setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        })
        .catch(error => console.log('error', error));
}
function detalhes(){
    window.location.hash = "#detalhes"
    hasts()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', '*')
    myHeaders.append('Access-Control-Allow-Methods', 'POSTS')
    myHeaders.append('Access-Control-Request-Method', '*')
    myHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    var id = window.localStorage.getItem("token").split("_")[1]
    fetch(`http://localhost:8080/api/auth/user-account/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            if(result.id == id){
                document.getElementById("username").value=result.username
                document.getElementById("phone").value =result.phone
                document.getElementById("email").value =result.email
               
            }
        })
        .catch(error => console.log('error', error));

}
function save(){
    let username = document.getElementById("username").value;
    let phone = document.getElementById("phone").value.replaceAll("-", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "");
    let email = document.getElementById("email").value;
    document.getElementById("usernameinfo").innerText = ""
    document.getElementById("emailinfo").innerText = ""
    document.getElementById("phoneinfo").innerText = ""
    var ok = true
    if (username.length < 3 || username == "" || username.includes("_")) {
        document.getElementById("usernameinfo").innerText = "Nome inválido"
        ok=false
    }
    if (!email.includes("@") || email == "") {
        document.getElementById("emailinfo").innerText = "E-mail inválido"
        ok=false
    }
    if (phone.length < 10 || phone == "" ) {
        document.getElementById("phoneinfo").innerText = "Telefone inválido"
        ok = false
    }
    if(ok){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "username": username,
        "email": email,
        "phone": phone
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        var id = window.localStorage.getItem("token").split("_")[1]
        fetch(`http://localhost:8080/api/auth/user-edit/${id}`, requestOptions)
            
        .then(response => response.text())
            .then(result => {
                setTimeout(() => {
                    window.localStorage.setItem("token", `${username}_${id}_${email}`)
                    window.location.reload()
                }, 100);
})
        .catch(error => console.log('error', error));
                    
        
    }
}
var agend = []
function agendamentos(){
    window.location.hash = "#agendamentos"
    hasts()

    exibesaloes()
    document.getElementById("agendamentos").innerHTML=""
    id = window.localStorage.getItem("token").split("_")[1]
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/companys/schedule-user/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => agend = JSON.parse(result))
        .catch(error => console.log('error', error));
    
    setTimeout(() => {
        converteJson()
    }, 100);
}
let cj=0
function converteJson() {
    cj=cj+1
    if (agend.length > 0) {
        addagendamentos(agend)
        document.getElementById("semage").style.display = "none"
    }
    else if(cj<2) {
        converteJson()
    }
    else{
        setTimeout(() => {
            exibesaloes()
            document.getElementById("semage").style.display = "flex"
        }, 100);
        
    }
}
function addagendamentos(agendamento){
    for (var i=0; i<agendamento.length;i++){
        agendamento[i].json = JSON.parse(agendamento[i].json)
        let name = agendamento[i].json.store
        let endereco = agendamento[i].json.endereco
        let telefone = agendamento[i].json.telefone
        let servico = agendamento[i].json.servico
        let htmltext = `
     <div id="servico-info">
                    <div class="titulo"><span id="data">${servico.dia} - ${servico.horario}</span>
                    <div class="onde"><span id="local">${name}</span><span id="endereço">${endereco} - ${telefone}</span></div></div>
                    <div class="info">
                    <p><span id="servico">${servico.nome}</span> - R$<span id="serviço">${servico.valor}</span></p>
                    <i class="fa fa-trash" aria-hidden="true" style="font-size: 25px; cursor: pointer;" onclick="deleteagendamento('${i}')"></i></div>
                </div>
    `
        setTimeout(() => {
            document.getElementById("agendamentos").insertAdjacentHTML("beforeend", htmltext)
        }, 100);
    }
         
}
function deleteagendamento(id){
    let id_ = agend[id].id
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/companys/schedule-delete/${id_}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    getSaloes();
    remove(id)
}
var saloes =[]
function getSaloes() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:8080/api/companys/all", requestOptions)
        .then(response => response.text())
        .then(result => { saloes = JSON.parse(result)[0].json
            saloes = JSON.parse(saloes.replaceAll("'", ""))
})
        .catch(error => console.log('error', error));


}


function remove(id) {
    let name = agend[id].json.store
    let servico = agend[id].json.servico
    setTimeout(() => {
        var salao = saloes.saloes.filter(function (obj) { return obj.name == name; })[0]
        salao.horarios.push(servico)
        cliente = window.localStorage.getItem("token").split("_")[0]
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
                    sendEmail(salao.email, salao.name, servico.nome, servico.dia, servico.horario)
                } else {
                    alert("Algo deu errado!")
                }
            })
            .catch(error => console.log('error', error));
    }, 100);
    
}
function sendEmail(email, store, nome, dia, hora) {    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email,
        "servico": `Olá ${store}, lembra do agendamento de ${nome} no dia ${dia} as ${hora}, cliente: ${cliente}, infelizmente foi cancelado!.`,
        "assunto": "Ah, um agendamento foi cancelado!"
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
    if (infoloading){
        document.getElementById("infoloading").innerText = infoloading
    }
    document.getElementById("loading").style.display = "flex"
    document.getElementById("agendamentos").style.display = "none"
}
function exibesaloes() {
    document.getElementById("loading").style.display = "none"
    document.getElementById("agendamentos").style.display = "grid"
}