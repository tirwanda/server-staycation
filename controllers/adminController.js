module.exports = {
    viewDasboard: (req, res) => {
        res.render('admin/dashboard/viewDashboard.ejs');
    },

    viewCategory: (req, res) => {
        res.render('admin/category/viewCategory.ejs');
    },

    viewBank: (req, res) => {
        res.render('admin/bank/viewBank.ejs');
    },

    viewItem: (req, res) => {
        res.render('admin/item/viewItem.ejs');
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/viewBooking.ejs');
    }
};