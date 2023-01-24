cidades = [
    
    {
        "nome": "Congonhas"
    },
    {
        "nome": "Conselheiro Lafaiete"
    },
    
    {
        "nome": "Ouro Branco"
    }
     
]

window.onload = function () {
    var token = window.localStorage.getItem("token")
    if (token) {
        document.getElementById("cadastro").innerText = "Olá, " + token.split("_")[0]
        document.getElementById("login").style.display="none"
        document.getElementById("exit").style.display = ""

        document.getElementById("exit").addEventListener("click", function () {
            console.log("click")
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
                .then(response => {if(response.status == 200){window.localStorage.removeItem("token");setTimeout(() => {
                    window.location.reload()
                }, 2000);}})
                .catch(error => console.log('error', error));
            
        })
    }
    else{
        document.getElementById("login").style.display = ""
        document.getElementById("exit").style.display = "none"


    }
    for(var i=0;i<cidades.length;i++){
        document.getElementById("select").insertAdjacentHTML("beforeend", `<option value='${cidades[i].nome}'>${cidades[i].nome}</option>`)

    }
    document.getElementById("search").addEventListener("click",function(){
        var select = document.getElementById("select");
        var city = select.options[select.selectedIndex].value.replaceAll(" ","_");
        var service= document.getElementById("service").value;
        var search = city +"-"+service
        console.log(search)
    })
}
