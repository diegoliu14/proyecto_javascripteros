"use-strict";

const api_route = "https://javascripteros-app.herokuapp.com"


let btnLogin = document.getElementById('btnLogin');
btnLogin.onclick = login_user;

let btnRegister = document.getElementById('btnRegister');
btnRegister.onclick = register_user;


function login_user(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${api_route}/api/login`)
    xhr.setRequestHeader('Content-Type', 'application/json')

    let emailValue = document.getElementById('correo').value;
    let passwordValue = document.getElementById('contra').value;

    let userAccount = {
        'email': emailValue,
        'password': passwordValue
    }

    xhr.send(JSON.stringify(userAccount))

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(`${xhr.status} : ${xhr.statusText}`);
        } else {
            sessionStorage.email = emailValue
            sessionStorage.token = JSON.parse(xhr.response).token
            window.location.href = "inicio.html"
        }
    }
}

function register_user(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${api_route}/api/users`)
    xhr.setRequestHeader('Content-Type', 'application/json')

    let nombre = document.getElementById('nom').value;
    let apellido = document.getElementById('ap').value;
    let email = document.getElementById('corr').value;
    let password = document.getElementById('contra').value;
    let confirmPassword = document.getElementById('contra1').value;
    let fecha = document.getElementById('fech').value;
    let username = document.getElementById('username').value;

    if (password == confirmPassword) {

        let user = {
            'name': nombre,
            'lastname': apellido,
            'email': email,
            'username': username,
            'password': password,
            'date': fecha
        }
    
        xhr.send(user)
    
        xhr.onload = function() {
            if (xhr.status != 200) {
                alert(`${xhr.status} : ${xhr.statusText}`);
            } else {
                alert('usuario registrado correctamente');
            }
        }

    }

}

