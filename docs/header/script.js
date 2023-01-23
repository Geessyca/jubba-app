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
    function link(page) {
        var url = window.location.href
        url = url.replace("index", page)
        return url
    }
    if (window.localStorage.getItem("token")) {
        document.getElementById("cadastro").innerText = "Olá, " + window.localStorage.getItem("token").split("_")[0]
        document.getElementById("login").innerText = "Sair"
        document.getElementById("login").addEventListener("click", function () {
            window.localStorage.removeItem("token")
        })
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
