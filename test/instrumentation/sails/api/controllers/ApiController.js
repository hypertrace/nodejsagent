function get(req, res) {
    res.json({msg: 'success'})
}

function post(req, res){
   var body = req.body
   res.json({msg: 'post success', data: body.data})
}

module.exports.get = get
module.exports.post = post