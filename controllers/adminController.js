module.exports = {
    viewDasboard: (req, res) => {
        res.render('admin/dashboard/viewDashboard.ejs');
    },

    viewCategory: (req, res) => {
        res.render('admin/category/viewCategory.ejs');
    }
};