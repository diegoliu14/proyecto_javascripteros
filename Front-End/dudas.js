"use-strict";

const api_route = "https://javascripteros-app.herokuapp.com"

let lista = document.getElementById("doubtList");

let btnAddDoubt = document.getElementById('btnAduda');
btnAddDoubt.onclick = addNewDoubt;

let btnLike = document.getElementById('btnLike');
btnLike.onclick = like;

let btnDislike = document.getElementById('btnDislike');
btnDislike.onclick = dislike;

let btnComment = document.getElementById('btnAcomentario');
btnComment.onclick = addComment;



function like(event) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/doubts/${title}`);
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
            alert('Doubt liked!');
            getAllDoubts();
        }
    }
}


function dislike(event) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${api_route}/api/doubts/${title}`);
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
            alert('Doubt disliked!');
            getAllDoubts();
        }
    }
}


function addComment(event) {

}


function addNewDoubt(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${api_route}/api/users/doubts`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)

    let title = document.getElementById('titduda');
    let description = document.getElementById('descduda');
    let email = sessionStorage.email;
    let username = sessionStorage.username;

    let newDoubt = {
        title,
        description,
        email,
        username
    }

    xhr.send(JSON.stringify(newDoubt));

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            getAllDoubts();
        }
    }
}


function getAllDoubts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${api_route}/api/users/doubts`);
    xhr.setRequestHeader('x-auth', sessionStorage.token)
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            doubtsIntoHTML(JSON.parse(xhr.response));
        }
    }
}


function itemToHTML(item) {
    return `
    <div class="media col-4">
        <div class="media-body">
            <h4 class="mt-0 mb-1">Título: X X X X X</h4>
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
            <h5>DUDA</h5>
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


function doubtsIntoHTML(doubts) {
    console.log("item list to html: " + JSON.stringify(doubts));
    lista.innerHTML = doubts.map(itemToHTML).join("\n");
}

getAllDoubts();