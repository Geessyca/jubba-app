function create(){
    let username = document.getElementById("username").value;
    let phone = document.getElementById("telefone").value.replaceAll("-", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ","");
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    document.getElementById("usernameinfo").innerText = ""
    document.getElementById("telefoneinfo").innerText = ""
    document.getElementById("emailinfo").innerText = ""
    document.getElementById("senhainfo").innerText = ""
    var ok = true
    if (username.length < 3 || username == "" || username.includes("_") ) {
        document.getElementById("usernameinfo").innerText = "Nome de usuário inválido"
        ok=false
    }
    if (phone.length < 10 || phone == "") {
        document.getElementById("telefoneinfo").innerText = "Telefone inválido"
        ok=false
    }
    if (!email.includes("@") || email == "") {
        document.getElementById("emailinfo").innerText = "E-mail inválido"
        ok=false
    }
    if (senha.length < 6 || senha == "") {
        document.getElementById("senhainfo").innerText = "Senha inválida"
        ok=false
    }
    if(ok){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "email": email,
            "phone": phone,
            "password": senha,
            "forgot": "",
            "role": [
                "user"
            ]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/auth/signup", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    login(username,senha)
                } else {
                    document.getElementById("geralinfo").innerHTML = `<h4>${response.message??"Usuário ou e-mail já cadastrado"}</h4>`
                }
            })

            .catch(error => document.getElementById("geralinfo").innerHTML = `<h4>${error}</h4>`);
    }

}
function login(username,senha){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', '*')
    myHeaders.append('Access-Control-Allow-Methods', 'POSTS')
    myHeaders.append('Access-Control-Request-Method', '*')
    myHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    var raw = JSON.stringify({
        "username": username,
        "password": senha
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/api/auth/signin", requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            if (result.username) {
                window.localStorage.setItem("token", `${result.username}_${result.id}_${result.email}`)
                window.location.href = "/jubba-app"
            } else {
                document.getElementById("geralinfo").innerText = "Algo de errado em logar usuário"

            }
        })
        .catch(error => console.log('error', error));
}