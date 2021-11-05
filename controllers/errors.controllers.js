exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
}

exports.handleNotAllowedMethods = (req, res) => {
    res.status(405).send({ msg: 'Method not allowed'})
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '42703') {
        res.status(400).send({msg:'Bad request - invalid data type'})
    } else {
        next(err);
    }
}

exports.handle500 = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server error'})
}

