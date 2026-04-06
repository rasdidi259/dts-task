/**
 * author       : Applicant
 * date         : 03/02/2026
 * description  : Validating Request Id 
 */


const {mongoose} = require('../config/setupmodules');

module.exports = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');
    next();
}