"use-strict";

const fs = require('fs')
const shortid = require('shortid');
let contentUserss = fs.readFileSync('users.json')
let contentProjectss = fs.readFileSync('projects.json')
let contentIdeass = fs.readFileSync('ideas.json')
let contentDoubtss = fs.readFileSync('doubts.json')
let contentCommentss = fs.readFileSync('comments.json')

let contentUsers = JSON.parse(contentUserss)
let contentProjects = JSON.parse(contentProjectss)
let contentIdeas = JSON.parse(contentIdeass)
let contentDoubts = JSON.parse(contentDoubtss)
let contentComments = JSON.parse(contentCommentss)

function getUserByEmail(email) {
    let user = contentUsers.find(user => user.email == email)
    console.log(`user: ${JSON.stringify(user)}`)
    return user
}

function getIdeaByTitle(title) {
    return contentIdeas.find(idea => idea.title == title)
}


function getDoubtByTitle(title) {
    return contentDoubts.find(doubt => doubt.title == title)
}


function getProjectByTitle(title) {
    return contentProjects.find(project => project.title == title)
}


function editIdea(title, idea) {
    contentIdeas.find(function(i) {
        if (i.title == title) {
            i.title = idea.title;
            i.description = idea.description;
        }
    });
    fs.writeFileSync('ideas.json', JSON.stringify(contentIdeas));
}


function editDoubt(title, doubt) {
    contentDoubts.find(function(d) {
        if (d.title == title) {
            d.title = doubt.title;
            d.description = doubt.description;
        }
    });
    fs.writeFileSync('doubts.json', JSON.stringify(contentDoubts));
}


function editProject(title, project) {
    contentProjects.find(function(p) {
        if (p.title == title) {
            p.title = project.title;
            p.description = project.description;
        }
    });
    fs.writeFileSync('projects.json', JSON.stringify(contentProjects));
}


function likeDoubt(title, body) {
    let likes = Number(body.likes);
    let dislikes = Number(body.dislikes);

    contentDoubts.find( function(doubt) {
        if (doubt.title == title) {
            if (likes != undefined) {
                doubt.likes = Number(doubt.likes) + likes;
            }

            if (dislikes != undefined) {
                doubt.dislikes = Number(doubt.dislikes) + dislikes;
            }
        }
    });
    
    fs.writeFileSync('doubts.json', JSON.stringify(contentDoubts));
}


function likeIdea(title, body) {
    let likes = Number(body.likes);
    let dislikes = Number(body.dislikes);

    contentIdeas.find( function(ideas) {
        if (ideas.title == title) {
            if (likes != undefined) {
                ideas.likes = Number(ideas.likes) + likes;
            }

            if (dislikes != undefined) {
                ideas.dislikes = Number(ideas.dislikes) + dislikes;
            }
        }
    });
    
    fs.writeFileSync('ideas.json', JSON.stringify(contentIdeas));
}


function likeProject(title, body) {
    let likes = Number(body.likes);
    let dislikes = Number(body.dislikes);

    contentProjects.find( function(project) {
        if (project.title == title) {
            if (likes != undefined) {
                project.likes = Number(project.likes) + likes;
            }

            if (dislikes != undefined) {
                project.dislikes = Number(project.dislikes) + dislikes;
            }
        }
    });
    
    fs.writeFileSync('projects.json', JSON.stringify(contentProjects));
}


function getUsers(){
    return contentUsers
}


function getComment(id){
    return contentComments.find(comment => comment.id == id)
}


function createUser(user) {
    user.uid = shortid.generate();
    contentUsers.push(user)
    fs.writeFileSync('users.json', JSON.stringify(contentUsers))
}


function updateUser(email, updatedUser) {

    contentUsers.find(function(user) {
        if (user.email == email) {
            user.name = updatedUser.name;
            user.lastname = updatedUser.lastname;
            user.date = updatedUser.date;
            if (updatedUser.url != undefined) {
                user.url = updatedUser.url;
            }
        }
    });

    fs.writeFileSync('users.json', JSON.stringify(contentUsers))
}


function createComment(comment) {
    comment.id = shortid.generate();
    contentComments.push(comment)
    fs.writeFileSync('comments.json', JSON.stringify(contentComments))

}


function getCommentByParent(parent) {
    return contentComments.filter(comment => comment.parent == parent)
}


function getAllUserIdeas(username) {
    return contentIdeas.filter(project => project.username == username)
}


function getAllUserDoubts(username) {
    return contentDoubts.filter(project => project.username == username)
}


function getAllUserProjects(username) {
    return contentProjects.filter(project => project.username == username)
}


function getAllIdeas() {
    return contentIdeas
}


function getAllDoubts() {
    return contentDoubts
}


function getAllProjects() {
    return contentProjects
}


function deleteIdea(title) {
    let index = contentIdeas.findIndex(idea => idea.title == title)
    if (index != -1) {
        let idea = contentIdeas.splice(index, 1)[0]
        fs.writeFileSync('ideas.json', JSON.stringify(contentIdeas))
        return idea;
    }
}


function deleteDoubt(title) {
    let index = contentDoubts.findIndex(doubt => doubt.title == title)
    if (index != -1) {
        let doubt = contentDoubts.splice(index, 1)[0]
        fs.writeFileSync('doubts.json', JSON.stringify(contentDoubts))
        return doubt;
    }
}


function deleteProject(title) {
    let index = contentProjects.findIndex(project => project.title == title)
    if (index != -1) {
        let project = contentProjects.splice(index, 1)[0]
        fs.writeFileSync('projects.json', JSON.stringify(contentProjects))
        return project;
    }
}


function createIdea(idea) {
    idea.id = shortid.generate();
    contentIdeas.push(idea)
    fs.writeFileSync('ideas.json', JSON.stringify(contentIdeas))
    return idea
}


function createDoubt(doubt) {
    doubt.id = shortid.generate();
    contentDoubts.push(doubt)
    fs.writeFileSync('doubts.json', JSON.stringify(contentDoubts))
    return doubt
}


function createProject(project) {
    project.id = shortid.generate();
    contentProjects.push(project)
    fs.writeFileSync('projects.json', JSON.stringify(contentProjects))
    return project
}


function generateToken(email) {
    let user = getUserByEmail(email);

    user.token = shortid.generate() + '-' + user.uid;
    
    fs.writeFileSync('users.json', JSON.stringify(contentUsers))

    return user.token;
}


function updateCommentLikes(id, like, dislike) {
    let index = contentComments.findIndex(comment => comment.id == id)
    contentComments[index].likes = contentComments[index].likes + like;
    contentComments[index].dislikes = contentComments[index].dislikes + dislike;
    fs.writeFileSync('comments.json', JSON.stringify(contentComments))
}

exports.getComment=getComment;
exports.getUserByEmail = getUserByEmail;
exports.getUsers= getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.generateToken = generateToken;
exports.deleteDoubt = deleteDoubt;
exports.deleteProject = deleteProject;
exports.deleteIdea = deleteIdea;
exports.getAllIdeas = getAllIdeas;
exports.getAllDoubts = getAllDoubts;
exports.getAllProjects = getAllProjects;
exports.getCommentByParent = getCommentByParent;
exports.getAllUserIdeas = getAllUserIdeas;
exports.getAllUserDoubts = getAllUserDoubts;
exports.getAllUserProjects = getAllUserProjects;
exports.createComment = createComment;
exports.createIdea = createIdea;
exports.createDoubt = createDoubt;
exports.createProject = createProject;
exports.updateCommentLikes = updateCommentLikes;
exports.getIdeaByTitle = getIdeaByTitle;
exports.getDoubtByTitle = getDoubtByTitle;
exports.getProjectByTitle = getProjectByTitle;
exports.editIdea = editIdea;
exports.editDoubt = editDoubt;
exports.editProject = editProject;
exports.likeDoubt = likeDoubt;
exports.likeIdea = likeIdea;
exports.likeProject = likeProject;