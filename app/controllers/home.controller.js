module.exports = () => {
    return {
        index: (req, res) => {
            return res.render('home', { user: req.user });
        },
    };
};

