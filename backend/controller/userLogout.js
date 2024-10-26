async function userLogout(req, res) {
    try {
      res.clearCookie('token')
  
     
      return res.status(200).json({
        message: 'User logged out successfully',
        error: false,
        success: true,
        data: [],
      });
    } catch (err) {
      
      return res.status(500).json({
        message: err.message || err ,
        error: true,
        success: false,
      });
    }
  }
  
  module.exports = userLogout