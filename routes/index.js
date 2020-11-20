const express = require('express')
const router = express.Router()

router.use(express.json())
let node ={ 'node_id':['node_info', 'name/location', 'description']}

async function getallNode(request, response) {
   
}

async function getcomment(req,res){

}

async function createHandler(request, response) {
   
}

async function createComment(req, res) {
  const node_id=req.body['nid']
  const content=req.body['comment']
  //gernerate a node_id
  c_id='50';
  //save comment to database
  //const r=await addComment(info,nodeName,des);
  node[c_id]=[content];
  console.log(node)
  res.send(c_id);
}

async function createNode(req, res) {
  const info = req.body['info'];
  const nodeName=req.body['name'];
  const des=req.body['description'];
  //gernerate a node_id
  node_id='50';
  //save node to database
  //const r=await addNode(info,nodeName,des);
  //node[node_id]=[info,nodeName,des];
  res.send(node_id);
}

/* home page route */
router.get('/node/all',getallNode);

router.get('/node/:nodeid/comment', getcomment)

router.post('/node/comments/create',createComment)

router.post('/nodes/create',createNode)

router.post('/user/favorite',createHandler)

module.exports = router
