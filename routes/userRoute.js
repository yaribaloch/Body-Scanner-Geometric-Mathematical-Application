const express = require("express")
const router = express.Router();
const {
    handleReqResetPassword,
    handleResetPassword,
    handleSetPreferences,
    handleSetSetting,
    handleOrderHistory
} = require("../controllers/userController")
const {restrictToLoginnedUserOnly} = require("../middlewares/auth")
router.post("/forget_password", handleReqResetPassword)
router.post("/reset_password", handleResetPassword)
router.use(restrictToLoginnedUserOnly)
router.post("/set_body_measurements", handleSetPreferences)
router.post("/set_style_preferences", handleSetPreferences)
router.post("/set_fit_preferences", handleSetPreferences)
router.post("/set_color_matching", handleSetPreferences)
router.post("/set_settings_pers", handleSetSetting)
router.post("/set_settings_notif", handleSetSetting)
router.get("/order_history", handleOrderHistory)


module.exports = router