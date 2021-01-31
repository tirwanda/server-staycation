module.exports = {
    viewDasboard: (req, res) => {
        res.render('admin/dashboard/viewDashboard.ejs');
    },

    viewCategory: (req, res) => {
        res.render('admin/category/viewCategory.ejs');
    },

    viewBank: (req, res) => {
        res.render('admin/bank/viewBank.ejs');
    }
};