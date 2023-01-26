window.onload = function () {



    document.querySelector(" .button-esqueci-minha-senha").addEventListener("click", function () {
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    document.getElementById("emailinfo").innerText = ""
    document.getElementById("usernameinfo").innerText = ""
    var ok = true
    if (email == "" && !email.includes("@")) {
        document.getElementById("emailinfo").innerText = "E-mail inválido"
        ok=false
    }
    if (username.length < 3 || username == "") {
        document.getElementById("usernameinfo").innerText = "Nome inválido"
        ok=false
    }
    
    if(ok) {
        document.querySelector(".right").innerHTML = `<h4 class='loading'><i class="fa fa-spinner fa-pulse" style="font-size: 45px;"></i></h4>`
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Access-Control-Allow-Origin', '*')
        myHeaders.append('Access-Control-Allow-Methods', 'POSTS')
        myHeaders.append('Access-Control-Request-Method', '*')
        myHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        var raw = JSON.stringify({
            "email": email,
            "username": username
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/auth/forgotpassword", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    document.querySelector(".right").innerHTML = `<h4>Enviamos o email de recuperação para ${email}. Acesse-o para recuperar sua senha!</h4>`
                    setTimeout(() => {
                        window.location.href = "/jubba-app"
                    }, 2000);
                } else {
                    document.querySelector(".right").innerHTML = `<h4>Algo deu errado tente novamente</h4>`
                    setTimeout(() => {
                       window.location.reload()
                    }, 2000);
                }
            })
            .catch(error => console.log('error', error));
    }
});}