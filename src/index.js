const express = require('express');
// const { uuid } = require('uuidv4');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar informações no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parametros
 * 
 * Query Params: Filtros e paginação (EXEMPLO NO .get)
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * 
 * Interceptador de requisições que interrompe a requisição ou altera os dados dela.
 */

const projects = [];

function logRequests(request, response, next) {
    const {method, url} = request;

    const loglabel = `[${method.toUpperCase()}] ${url}`;

    console.log(loglabel);
    
    return next();
}

function validadeProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "Invalid project ID"});
    }
    return next();
}

app.use(logRequests);
app.use('/project/:id', validadeProjectId);

app.get ('/projects',(request, response) => {
    const { title } = request.query;
    const results = title  ? projects.filter(project => project.title.includes(title)) 
    : projects;

    return response.json(results);
});

app.post ('/projects',(request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(),title, owner};
    projects.push(project);

    return response.json(project);
}); 

app.put ('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex < 0)  {    
        return response.status(400).json ({ error: 'project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
}); 

app.delete ('/projects/:id', (request, response) => {

    const {id} = request.params;
    

    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex < 0)  {    
        return response.status(400).json ({ error: 'project not found.' })
    }
    projects.splice(projectIndex, 1);

    return response.status(204).send();
}); 
app.listen(3333, () => {
    console.log('back-end started!');
});