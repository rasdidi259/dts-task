/**
 * author       : Applicant
 * date         : 03/02/2026
 * description  : A module for validate (Request / Response Status - Success / Erorr Failed)
 */


module.exports = (validator) => {
    return (req, res, next) => {
        const { error } = validator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    };
};