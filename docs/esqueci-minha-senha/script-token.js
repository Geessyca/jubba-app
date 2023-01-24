window.onload = function () {


    document.querySelector(" .button-esqueci-minha-senha").addEventListener("click", function () {
    let senha = document.getElementById("senha").value;
    document.getElementById("senhainfo").innerText = ""
        if (senha.length < 6 || senha == "") {
        document.getElementById("senhainfo").innerText = "Senha inválida"
    }
    
    else {
        document.querySelector(".right").innerHTML = `<h4 class='loading'><i class="fa fa-spinner fa-pulse" style="font-size: 45px;"></i></h4>`
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Access-Control-Allow-Origin', '*')
            myHeaders.append('Access-Control-Allow-Methods', 'POSTS')
            myHeaders.append('Access-Control-Request-Method', '*')
            myHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        var raw = JSON.stringify({
            "password": senha
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        var token = window.location.hash.replace("#", "")
            fetch(`http://localhost:8080/api/auth/forgotpassword/${token}`, requestOptions)
                .then(response => {if(response.status == 200){ document.querySelector(".right").innerHTML = `<h4>Senha alterada com sucesso!</h4>`; 
                    setTimeout(() => {
                        window.location.href = "/jubba-app/login"
                    }, 2000);
                } else{document.querySelector(".right").innerHTML = `<h4>Algo deu errado tente novamente</h4>`
                setTimeout(() => {
                    window.location.href = "/jubba-app/esqueci-minha-senha"
                }, 2000);} })

            .catch(error => console.log('error', error));


    }
});}