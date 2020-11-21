const express = require('express')
const router = express.Router()
const db=require('../db_func')

router.use(express.json())
let node ={ 'node_id':['node_info', 'name/location', 'description']}

async function getallNode(req, res) {
   const content=await db.Get_ALLNode()
   //console.log(content)
   res.json(content)
}

async function getcomment(req,res){
  const nid=req.params.node_id
  console.dir(nid)
  const content=await db.Get_NodeComment(nid)
  console.log(content)
  res.json(content)
}

//TODO
async function Create_fav(request, response) {
   
}


/* home page route */
router.get('/node/all',getallNode);

router.get('/node/comment/:node_id', getcomment)

//router.post('/nodes/create',createNode)

router.post('/user/favorite',Create_fav)

module.exports = router
