exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    
}

exports.handle500 = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server error'})
}
