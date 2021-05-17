"use-strict";


const express = require('express');
const dataHandler = require('./dataHandler.js');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());


function authenticate(req, res, next) {
    let token = req.get('x-auth');
    if (token == undefined) {
        res.status(401).send('No token provided, make sure to login first.');
    } else {
        let uid = token.split('-').pop();
        // validate token + user.
        let user = dataHandler.getUsers().find(user => user.uid == uid);
        if (user == undefined || user.token != token) {
            res.status(401).send('Invalid token. Try again.');
        }
        req.uid = user.uid;
        next();
    }
}


app.get('/', (req, res) => res.send('Welcome to javascripteros project'));


/*
    LOGIN USER
*/
app.post('/api/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email == undefined || password == undefined) {
        res.status(401).send('Empty email or password')
    }

    let token = dataHandler.generateToken(email);
    console.log(`token: ${token}`)
    if (token == null) {
        res.status(401).send('Invalid email or password');
    } else {
        res.set('x-auth', token);
        res.status(200).json({
            'token': token
        });
    }
});


/*
    REGISTER USER
*/
app.post('/api/users', (req, res) => {
    let user = req.body
    
    if (user.name == undefined) {
        res.status(400).send('field name is missing')
    }
    if (user.lastname == undefined) {
        res.status(400).send('field lastname is missing')
    }
    if (user.email == undefined) {
        res.status(400).send('field email is missing')
    }
    if (user.password == undefined) {
        res.status(400).send('field password is missing')
    }
    if (user.date == undefined) {
        res.status(400).send('field date is missing')
    }
    if (user.username == undefined) {
        res.status(400).send('field username is missing')
    }

    user.projects = 0;
    user.ideas = 0;
    user.doubts = 0;

    if (dataHandler.getUserByEmail(user.email)) {
        res.status(400).send('User already registered with the same email!')
    }

    dataHandler.createUser(user)
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.status(201).send(dataHandler.getUserByEmail(user.email))
})


/*
    GET USER INFO
*/
app.get('/api/users/:email', authenticate, (req, res) => {
    let email = req.params.email;
    if (email == undefined) {
        res.status(400).send("missing email parameter")
    }
    let user = dataHandler.getUserByEmail(email);

    if (user == undefined) {
        res.send("didnt find the user")
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(user)
});


/*
    EDIT USER INFO
*/
app.put('/api/users/:email', authenticate, (req, res) => {
    let email = req.params.email;
    let mBody = req.body;

    let name = mBody.name;
    let lastname = mBody.lastname;
    let date = mBody.date;

    if (name == undefined) {
        res.status(404).send("missing name parameter")   
    }
    if (lastname == undefined) {
        res.status(404).send("missing lastname parameter")   
    }
    if (date == undefined) {
        res.status(404).send("missing date parameter")   
    }

    dataHandler.updateUser(email, mBody);

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(dataHandler.getUserByEmail(email))
});


/*
    EDIT IDEA
*/
app.put('/api/users/ideas/:title', authenticate, (req, res) => {
    let title = req.params.title;
    let idea = req.body;

    let ideaToModify = dataHandler.getIdeaByTitle(title);
    if (ideaToModify == undefined) {
        res.status(404).send("idea not found");
    }

    dataHandler.editIdea(title, idea);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(dataHandler.getIdeaByTitle(idea.title))

});



/*
    EDIT IDEA
*/
app.put('/api/users/ideas/:title', authenticate, (req, res) => {
    let title = req.params.title;
    let idea = req.body;

    let ideaToModify = dataHandler.getIdeaByTitle(title);
    if (ideaToModify == undefined) {
        res.status(404).send("idea not found");
    }

    dataHandler.editIdea(title, idea);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(dataHandler.getIdeaByTitle(idea.title))

});


/*
    EDIT DOUBT
*/
app.put('/api/users/doubts/:title', authenticate, (req, res) => {
    let title = req.params.title;
    let doubt = req.body;

    let doubtToModify = dataHandler.getDoubtByTitle(title);
    if (doubtToModify == undefined) {
        res.status(404).send("doubt not found");
    }

    dataHandler.editDoubt(title, doubt);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(dataHandler.getDoubtByTitle(doubt.title))

});


/*
    EDIT PROJECT
*/
app.put('/api/users/projects/:title', authenticate, (req, res) => {
    let title = req.params.title;
    let project = req.body;

    let projectToModify = dataHandler.getProjectByTitle(title);
    if (projectToModify == undefined) {
        res.status(404).send("project not found");
    }

    dataHandler.editProject(title, project);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(dataHandler.getProjectByTitle(project.title))

});


/*
    LIKE DOUBT
*/
app.put('api/doubts/:title', authenticate, (req, res) => {
    let title = req.params.title;
    
    let doubt = dataHandler.likeDoubt(title, req.body)

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(doubt)

});


/*
    LIKE IDEA
*/
app.put('api/ideas/:title', authenticate, (req, res) => {
    let title = req.params.title;
    
    let idea = dataHandler.likeIdea(title, req.body)

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(idea)

});


/*
    LIKE DOUBT
*/
app.put('api/ideas/:title', authenticate, (req, res) => {
    let title = req.params.title;
    
    let doubt = dataHandler.likeDoubt(title, req.body)

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(doubt)

});


/*
    LIKE PROJECT
*/
app.put('api/projects/:title', authenticate, (req, res) => {
    let title = req.params.title;
    let project = dataHandler.likeProject(title, req.body)

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(project)
});


/*
    LIKE PROJECT
*/
app.put('api/projects/:title', authenticate, (req, res) => {
    let title = req.params.title;
    
    let project = dataHandler.likeProject(title, req.body)

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(project)

});


/*
    ADD COMMENT
*/
app.post('/api/comments', authenticate, (req, res) => {
    let comment = req.body.description;
    
    if (comment == undefined) {
        res.status(400).send("empty comment body")
    }
    let body = req.body;

    dataHandler.createComment(body)
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.status(201).send(dataHandler.getComment(comment.id))
});



/*
    GET ALL COMMENTS FROM PARENT
*/
app.get('/api/comments/:parent', authenticate, (req, res) => {
    let parent = req.params.parent
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.send(dataHandler.getCommentByParent(parent))
});



/*
    CREATE IDEA
*/
app.post('/api/users/ideas', authenticate, (req, res) => {
    let idea = req.body

    if (idea.title == undefined) {
        res.status(400).send('field title is missing')
    }
    if (idea.description == undefined) {
        res.status(400).send('idea text is missing')
    }


    let addedIdea = dataHandler.createIdea(idea)
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.status(201).send(addedIdea)
})


/*
    CREATE DOUBT
*/
app.post('/api/users/doubts', authenticate, (req, res) => {
    let doubt = req.body

    if (doubt.title == undefined) {
        res.status(400).send('field title is missing')
    }
    if (doubt.description == undefined) {
        res.status(400).send('doubt text is missing')
    }


    let addedDoubt = dataHandler.createDoubt(doubt)
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.status(201).send(addedDoubt)
});



/*
    CREATE PROJECT
*/
app.post('/api/users/projects', authenticate, (req, res) => {
    let project = req.body

    if (project.title == undefined) {
        res.status(400).send('field title is missing')
    }
    if (project.description == undefined) {
        res.status(400).send('project text is missing')
    }


    let addedProject = dataHandler.createProject(project)
    res.set('Content-Type', 'application/json; charset=utf-8')
    res.status(201).send(addedProject)
});


/*
    LIKE OR DISLIKE COMMENT
*/
app.put('/api/comments', authenticate, (req, res) => {
    let parent = req.body.parent;
    let like = req.body.like;
    let dislike = req.body.dislike;

    let updatedComment = dataHandler.updateCommentLikes(parent, like, dislike);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(updatedComment)
});



/*
    GET ALL USER IDEAS
*/
app.get('/api/users/ideas/:username', authenticate, (req, res) => {
    let username = req.params.username;
    if (username == undefined) {
        res.status(400).send("missing username parameter")
    }
    let userIdeas = dataHandler.getAllUserIdeas(username);

    if (userIdeas == undefined) {
        res.send("didnt find user ideas")
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(userIdeas)
});


/*
    GET ALL USER DOUBTS
*/
app.get('/api/users/doubts/:username', authenticate, (req, res) => {
    let username = req.params.username;
    if (username == undefined) {
        res.status(400).send("missing emausernameil parameter")
    }
    let userDoubts = dataHandler.getAllUserDoubts(username);

    if (userDoubts == undefined) {
        res.send("didnt find user doubts")
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(userDoubts)
});


/*
    GET ALL USER PROYECTS
*/
app.get('/api/users/proyects/:username', authenticate, (req, res) => {
    let username = req.params.username;
    if (username == undefined) {
        res.status(400).send("missing username parameter")
    }
    let userProjects = dataHandler.getAllUserProjects(username);

    if (userProjects == undefined) {
        res.send("didnt find user projects")
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(userProjects)
});



/*
    GET ALL IDEAS
*/
app.get('/api/ideas', authenticate, (req, res) => {
    let ideas = dataHandler.getAllIdeas();
    if (ideas == undefined) {
        res.send("didnt find ideas")
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(ideas)
});


/*
    GET ALL DOUBTS
*/
app.get('/api/doubts', authenticate, (req, res) => {
    let doubts = dataHandler.getAllDoubts();
    if (doubts == undefined) {
        res.send("didnt find doubts")
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(doubts)
});


/*
    GET ALL PROJECTS
*/
app.get('/api/projects', authenticate, (req, res) => {
    let projects = dataHandler.getAllProjects();
    if (projects == undefined) {
        res.send("didnt find projects")
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(projects)
});


/*
    DELETE IDEA
*/
app.delete('/api/ideas/:title', authenticate, (req, res) => {
    let title = req.params.title;

    if (title == undefined) {
        res.status(404).send('missing title')
    }
    let idea = dataHandler.deleteIdea(title);
    if (idea == undefined) {
        res.status(404).send('Idea doesnt exist')
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(idea)
});


/*
    DELETE DOUBT
*/
app.delete('/api/doubts/:title', authenticate, (req, res) => {
    let title = req.params.title;

    if (title == undefined) {
        res.status(404).send('missing title')
    }
    let doubt = dataHandler.deleteDoubt(title);
    if (doubt == undefined) {
        res.status(404).send('Doubt doesnt exist')
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(doubt)
});


/*
    DELETE PROJECT
*/
app.delete('/api/projects/:title', authenticate, (req, res) => {
    let title = req.params.title;

    if (title == undefined) {
        res.status(404).send('missing title')
    }
    let project = dataHandler.deleteProject(title);
    if (project == undefined) {
        res.status(404).send('Project doesnt exist')
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(project)
});


app.listen(port, () => {
    console.log(`server app listening on port ${port}!`);
})
  