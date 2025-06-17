//
// TODO:  Write a authenticateJWT and authenticateAPI middlewares

const authenticateJWT = (req, res, next) => {
  // get JWT token from request header bearer token
  // extract JWT token from bearer
  // verify token
  // attach user to req.user = {id: id, role: role}
  // next()
};
const authenticateAPI = (req, res, next) => {
  // get API key from request header [x-api-key]
  //   query DB 'api_keys' model and findOne {apikey, revoked: false}. Then populate user
  // attach user to req.user = {id: user._id, role: user.role}
  // next()
};

export const authenticate = [authenticateJWT, authenticateAPI];
