
export const loginUser = async (req, res, next) => {
    try {  
        res['successfullPost'](req.user);
    } catch (error) {
        next(error);
    }
};

  
export const getCurrentSessionUser = async (req, res, next) => {
    try { 
        res['successfullGet'](req.user);
    } catch (error) {
        next(error);
    }
};
  
export const logoutUser = async (req, res, next) => {
    try {
        res['successfullDelete']();
    } catch (error) {
        next(error);
    }
};