"use-strict";

const api_route = "https://javascripteros-app.herokuapp.com"

let whoClickedEditBtn = undefined;

let whoClickedDeleteBtn = undefined;

let lista = document.getElementById('lista');

let btnEditUser = document.getElementById('btnEgeneral');
btnEditUser.onclick = editUser;

let btnEditItem = document.getElementById('btnAgeneral');
btnEditItem.onclick = editItem;

let editParentBtn = document.getElementById('editParentBtn')
editParentBtn.onclick = setWhoClickedEditBtn;

let deleteParentBtn = document.getElementById('deleteParentBtn')
deleteParentBtn.onclick = setWhoClickedDeleteBtn;

let btnDeleteItem = document.getElementById('');
btnDeleteItem.onclick = deleteItem;


function setWhoClickedEditBtn(event) {
    whoClickedEditBtn = event.target.tagName;
    console.log(`who clicked edit btn: ${whoClickedEditBtn}`);
}

function setWhoClickedDeleteBtn(event) {
    whoClickedDeleteBtn = event.target.tagName;
    console.log(`who clicked delete btn: ${whoClickedDeleteBtn}`);
}


function deleteItem(event) {
    let split = whoClickedDeleteBtn.split('-');
    let typeClickedItem = split[0];
    let titleClickedItem = split[1];

    if (typeClickedItem == 'DOUBT') {
        deleteDoubt(titleClickedItem);
    }

    if (typeClickedItem == 'IDEA') {
        deleteIdea(titleClickedItem);
    }

    if (typeClickedItem == 'PROJECT') {
        deleteProject(titleClickedItem);
    }
}


function deleteIdea(title) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${api_route}/api/ideas/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Idea deleted correctly');
            getUserInfo();
        }
    }
}


function deleteDoubt(title) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${api_route}/api/doubts/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Doubt deleted correctly');
            getUserInfo();
        }
    }
}


function deleteProject(title) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${api_route}/api/projects/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Project deleted correctly');
            getUserInfo();
        }
    }
}


function editItem(event) {
    event.preventDefault();

    let split = whoClickedEditBtn.split('-');
    let typeClickedItem = split[0];
    let titleClickedItem = split[1];

    let titulo = document.getElementById('titgeneral').value;
    let descripcion = document.getElementById('descgeneral').value;

    let body = {
        "title": titulo,
        "description": descripcion
    }
    
    if (typeClickedItem == 'DOUBT') {
        editDoubt(titleClickedItem, body);
    }

    if (typeClickedItem == 'IDEA') {
        editIdea(titleClickedItem, body);
    }

    if (typeClickedItem == 'PROJECT') {
        editProject(titleClickedItem, body);
    }
}


function editIdea(title, body) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/users/ideas/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send(JSON.stringify(body));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Idea updated correctly');
            getUserInfo();
        }
    }
}


function editDoubt(title, body) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/users/doubts/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send(JSON.stringify(body));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Doubt updated correctly');
            getUserInfo();
        }
    }
}


function editProject(title, body) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/users/projects/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send(JSON.stringify(body));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Project updated correctly');
            getUserInfo();
        }
    }
}


function getUserInfo() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/${sessionStorage.email}`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            fillUserInfo(JSON.parse(xhr.response));
            let ideas = getUserIdeas();
            let projects = getUserProjects();
            let doubts = getUserDoubts();

            let itemList = {
                ideas,
                projects,
                doubts
            }

            itemListToHTML(itemList);
        }
    }
}


function fillUserInfo(user) {
    sessionStorage.username = user.username;
    let profilePic = document.getElementById('profilePicture')
    let nombre = document.getElementById('uName');
    let email = document.getElementById('uEmail');
    let date = document.getElementById('uDate');
    let projectsCount = document.getElementById('projectsCount');
    let ideasCount = document.getElementById('ideasCount');
    let doubtsCount = document.getElementById('doubtsCount');
    

    if (user.url == undefined) {
        profilePic.src = "./default-pic.png"
    } else {
        profilePic.src = user.url;
    }

    nombre.innerText =  `Nombre: ${user.name} ${user.lastname}`;
    email.innerText = `Correo: ${user.email}`;
    date.innerText = `Fecha de nacimiento: ${user.date}`;
    projectsCount.innerText = `Proyectos: ${Number(user.projects)}`;
    ideasCount.innerText = `Ideas: ${Number(user.ideas)}`;
    doubtsCount.innerText = `Dudas: ${Number(user.doubts)}`;

    
}


function getUserProjects() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/projects/${sessionStorage.username}`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
            return undefined
        } else {
            return JSON.parse(xhr.response);
        }
    }
}


function getUserIdeas() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/ideas/${sessionStorage.username}`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
            return undefined
        } else {
            return JSON.parse(xhr.response);
        }
    }
}


function getUserDoubts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/doubts/${sessionStorage.username}`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
            return undefined
        } else {
            return JSON.parse(xhr.response);
        }
    }
}


function itemToHTML(item) {
    if (item != undefined) {
        return `
        <div class="col-12 d-flex justify-content-center">
            <div class="media col-4">
            <div class="media-body">
                <h4 class="mt-0 mb-1">Título: ${item.title}</h4>
                <h5>Descripción:</h5>
                <p>${item.description}</p>
                <p>Autor: ${item.author}</p>
                <div class="d-flex align-items-end">
                    <div media-body>
                        <h5>Votos a favor: ${item.likes}</h5>
                        <h5>Votos en contra: ${item.dislikes}</h5>
                    </div>
                </div>
            </div>
            <div media-right >
                <h5>${item.type}</h5>
                <button name="${item.type}-${item.title}" class="btn btn-primary" href="#" data-toggle="modal" data-target="#Modalgeneral">Editar</button>
                <button name="${item.type}-${item.title}" class="btn btn-primary" href="#" data-toggle="modal" data-target="#ModalEliminar">Eliminar</button>
            </div>
            </div>
        </div>
        <br>`
    } 
}


function itemListToHTML(itemList) {
    console.log("item list to html: " + JSON.stringify(itemList));
    lista.innerHTML = itemList.map(itemToHTML).join("\n");
}


function editUser(event) {
    event.preventDefault();
    let nombre = document.getElementById('Enom').value;
    let apellido = document.getElementById('Eap').value;
    let fecha = document.getElementById('Efech').value;
    let url = document.getElementById('Eurl').value;

    let update = {
        'name': nombre,
        'lastname': apellido,
        'date': fecha,
        'url': url
    }

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/users/${sessionStorage.username}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send(JSON.stringify(update));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('User updated correctly');
            getUserInfo();
        }
    }
}


getUserInfo();