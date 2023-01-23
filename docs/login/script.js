window.onload = function () {
    if (window.localStorage.getItem("token")){
        var home = window.location.href
        home = home.replace("login", "index")
        window.location.href = home
    }
    function linklogin(page) {
        var url = window.location.href
        url = url.replace("login", page)
        return url
    }
    document.getElementById("home").attributes.href.value = linklogin("index")
    document.getElementById("esqueci-minha-senha").attributes.href.value = linklogin("esqueci-minha-senha")
    document.getElementById("cadastro").attributes.href.value = linklogin("cadastro")
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
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    document.getElementById("emailinfo").innerText = ""
    document.getElementById("senhainfo").innerText = ""
    document.getElementById("captchainfo").innerText = ""
    if (email == "" && !email.includes("@")) {
        document.getElementById("emailinfo").innerText = "E-mail inválido"
    }
    if (inputcaptchavalue != captchaValue) {
        document.getElementById("captchainfo").innerText = "Captcha inválido"
    }
    if (senha.length < 6 || senha == "") {
        document.getElementById("senhainfo").innerText = "Senha inválida"
    }
    
    else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": email,
            "password": senha
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/auth/signin", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    result = JSON.parse(response)
                    window.localStorage.setItem("token", `${result.username}_${result.id}_${result.email}`)
                    window.location.href = linklogin("index")
                } else {
                    console.log(response)
                    document.getElementById("geralinfo").innerText = "E-mail ou senha invalidos"
                  
                }
            })
            .catch(error => console.log('error', error));
    }
});}