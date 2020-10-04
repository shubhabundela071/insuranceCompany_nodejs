require('./../global_functions');
require('./../global_constants');

module.exports = {
    //Admin can access
    AdminAccess: (req, res, next) => {
        if (req.user.user_type === "super_admin") {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },
 //Customer can access
    CustomerAccess: (req, res, next) => {
        if (req.user.userType === 1) {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },
    
    OwnersAccess: (req, res, next) => {
        if (req.user.userType === 2) {
            return next();
        }
        else if (req.user.userType === 3) {
            return next();
        } else {
            return forbiddenError(res,"Not Authorized");
        }
    },
   
    checkRole: (roleIds) => {
        return function (req, res, next) {
         
            if (req.user.roles.indexOf(roleIds) !== -1) {
                return next();
            } else {
                return forbiddenError(res,"Not Authorized");
            }
        }
    }
}
