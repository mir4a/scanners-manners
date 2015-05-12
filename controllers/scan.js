/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('scan', {
    title: 'Scanner\'s Manners'
  });
};
