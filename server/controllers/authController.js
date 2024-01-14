module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.register_post = (req, res) => {
    res.send('new signup')
}

module.exports.login_post = (req, res) => {
    res.send('user login')
}