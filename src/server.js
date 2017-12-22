const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];
let nextId = 1;

function getNextId() {
    return nextId++;
}
/*let posts = [
    { title: "first",
      contents: "bbabab",
      id: 0
},
    { title: "second",
      contents: "ahdhah",
      id: 1
}
];*/


const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/*server.get("/posts/:term", function(req, res) {
    const post = posts.find(post => post.title.includes(req.params.term) || post.contents.includes(req.params.term));
    res.status(200).json(post);
});
*/

server.get('/posts', function(req,res) {
    //req.query.term
    const searchTerm = req.query.term;
    if(searchTerm){
        //filter the collection 
        const filteredPosts = posts.filter(post => {
            return post.title.includes(searchTerm) || post.contents.includes(searchTerm);
        })
        res.status(200).json(filteredPosts);
    } else {
        res.status(200).json(posts);
    }
});

/*server.post('/posts', function(req, res) {
    if(typeof req.body.title == 'string' && typeof req.body.contents =='string'){
        let post = {title: req.body.title, contents: req.body.contents, id: posts.length}
        posts.push(post);
        res.status(200).json(post);
    } else {
        res.status(503).json({error: "Post: missing title and/or body"});
    }
});*/

server.post('/posts', function( req, res){
    const {title, contents} = req.body;
    if(title && contents) {
         //unique id
        const id = getNextId();
        //craft the post object
        const post = req.body; // {title, contents}
        post.id = id;
        // Object.assign({}, req.body, {id});
        // const post = {...req.body, id}

         // add post to posts array
        posts.push(post);
        res.status(200).json(post);

         // return the new post
         } else {                                    
        res.status(STATUS_USER_ERROR).json({error: "Please provide title and content"});
    }
});

/*server.put("/posts", function(req, res) {
    if(typeof req.body.title == 'string' && typeof req.body.contents == 'string' && typeof req.body.id == 'string'){
        if( parseInt(req.body.id) && parseInt(req.body.id) <= posts.length){
            let post = { title: req.body.title, contents: req.body.contents, id: req.body.id}
            posts[req.body.id] = post;
          } else {
              console.log(parseInt(req.body.id));
              res.status(503).json({ error: "POST: ID not found"});
          }
        } else {
            res.status(503).json({ error: "POST: missing title, body, or ID"});
        }
    });
*/
server.put('/posts', function(req,res) {
    const { id, title, contents } = req.body;

    if(id && title && contents) {
        let post = posts.find(p => p.id === Number(id));
        // if the post is not found return error
        if (post){
            Object.assign(post, req.body);
            res.status(200).json(post);
        } else {
          res.status(STATUS_USER_ERROR).json({ error: 'The post does not exist.'});
        }
    } else {
        res
        .status(STATUS_USER_ERROR)
        .json({ error: 'Please provide all the information'}); 
    }
});

/*server.delete("/posts/:id", function(req,res){
    if(req.params.id && req.params.id <= posts.length){
        posts = posts.splice(req.params.id, 1);
        req.status(200).json({success:true});
    }
    else {
        res.status(404).json({ error: "DELETE: could not find item to be deleted"});
    }
}); */

server.delete('/posts', function(req, res){
    const{id} = req.body;
    if(id){
        let postIndex = posts.findIndex(p => p.id === Number(id));
        //if the post is not found return error
        if (postIndex > -1) {
        posts.splice(postIndex, 1);
        res.status(200).json({success: true});
    } else {
        res.status(STATUS_USER_ERROR).json({error: 'The Post does not exist.'});
    }
    } else {
        res
        .status(STATUS_USER_ERROR)
        .json({error: 'Please provide a valid id.'});
    }
});
 

module.exports = { posts, server };
