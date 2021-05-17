"use-strict";

const api_route = "https://javascripteros-app.herokuapp.com"

let lista = document.getElementById("ideasList");

let btnAddIdea = document.getElementById('btnAproy');
btnAddIdea.onclick = addNewIdea;

let btnLike = document.getElementById('btnLike');
btnLike.onclick = like;

let btnDislike = document.getElementById('btnDislike');
btnDislike.onclick = dislike;

let btnComment = document.getElementById('btnAcomentario');
btnComment.onclick = addComment;



function like(event) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/ideas/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)

    let body = {
        "likes": 1
    }

    xhr.send(JSON.stringify(body));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Idea liked!');
            getAllIdeas();
        }
    }
}


function dislike(event) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/ideas/${title}`);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', sessionStorage.token)

    let body = {
        "dislikes": 1
    }

    xhr.send(JSON.stringify(body));
    
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert('Idea disliked!');
            getAllIdeas();
        }
    }
}


function addComment(event) {
    
}


function addNewIdea(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${api_route}/api/users/ideas`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)

    let title = document.getElementById('nomproy');
    let description = document.getElementById('descproy');
    let email = sessionStorage.email;
    let username = sessionStorage.username;

    let newIdea = {
        title,
        description,
        email,
        username
    }

    xhr.send(JSON.stringify(newIdea));

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            getAllIdeas();
        }
    }
}


function getAllIdeas() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/ideas`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            ideasIntoHTML(JSON.parse(xhr.response));
        }
    }
}


function itemToHTML(item) {
    return `
    <div class="media col-4">
        <div class="media-body">
            <h4 class="mt-0 mb-1">Título: ${item.title}</h4>
            <h5>Descripción:</h5>
            <p>${item.description}</p>
            <p>Autor: ${item.author}</p>
            <div class="d-flex align-items-end">
                <div media-body>
                    <h5>Votos a favor: ${Number(item.likes)}</h5>
                    <h5>Votos en contra: ${Number(item.dislikes)}</h5>
                </div>
            </div>
        </div>
        <div media-right>
            <h5>IDEA</h5>
            <div class="d-flex align-items-end" media-right>
                <button name="${item.title}" id="btnLike" class="btn btn-primary "><i class="far fa-thumbs-up"></i></button><br><br>
                <button name="${item.title}" id="btnDislike" class="btn btn-primary"><i class="far fa-thumbs-down"></i></button><br><br>
            </div>
            <br>
            <button name="${item.title}" class="btn btn-primary" href="#" data-toggle="modal"
                data-target="#Modalcomentario">Comentar</button>
        </div>
    </div>`
}


function ideasIntoHTML(ideas) {
    console.log("item list to html: " + JSON.stringify(ideas));
    lista.innerHTML = ideas.map(itemToHTML).join("\n");
}


getAllIdeas();