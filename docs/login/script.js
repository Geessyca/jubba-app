window.onload = function () {
    if (window.localStorage.getItem("token")){
        window.location.href = "/jubba-app"
    }
   
const fonts = ["cursive"];
let captchaValue = "";
function gencaptcha() {
    let value = btoa(Math.random() * 1000000000);
    value = value.substr(0, 5 + Math.random() * 5);
    captchaValue = value;
}

function setcaptcha() {
    let html = captchaValue.split("").map((char) => {
        const rotate = -20 + Math.trunc(Math.random() * 30);
        const font = Math.trunc(Math.random() * fonts.length);
        return `<span
            style="
            transform:rotate(${rotate}deg);
            font-family:${font[font]};
            "
           >${char} </span>`;
    }).join("");
    document.querySelector(" #captcha .preview").innerHTML = html;
}

function initCaptcha() {
    document.querySelector(" #captcha .captcharefersh").addEventListener("click", function () {
        gencaptcha();
        setcaptcha();
    });

    gencaptcha();
    setcaptcha();
}
initCaptcha();

document.querySelector(" .button-login").addEventListener("click", function () {
    let inputcaptchavalue = document.querySelector(" #captcha input").value;
    let username = document.getElementById("username").value;
    let senha = document.getElementById("senha").value;
    document.getElementById("usernameinfo").innerText = ""
    document.getElementById("senhainfo").innerText = ""
    document.getElementById("captchainfo").innerText = ""
    var ok = true
    if (username == "" ) {
        document.getElementById("usernameinfo").innerText = "Nome de usuário inválido"
        ok=false
    }
    if (inputcaptchavalue != captchaValue) {
        document.getElementById("captchainfo").innerText = "Captcha inválido"
        ok=false
    }
    if (senha.length < 6 || senha == "") {
        document.getElementById("senhainfo").innerText = "Senha inválida"
        ok=false
    }
    
    if(ok) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Access-Control-Allow-Origin','*')
        myHeaders.append('Access-Control-Allow-Methods','POSTS')
        myHeaders.append('Access-Control-Request-Method','*')
        myHeaders.append('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
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
                if (result.username ) {
                    window.localStorage.setItem("token", `${result.username}_${result.id}_${result.email}`)
                    window.history.back();
                } else {
                    document.getElementById("geralinfo").innerText = "Nome de usuário ou senha invalidos"

                }
            })
            .catch(error => console.log('error', error));
    }
});}