import { Router } from "express";
const router = Router();

import {contactUs, stats} from '../controllers/miscellaneous.controller.js';
import {isLoggedIn, authorisedRoles} from '../middleware/auth.middleware.js'

router.post("/contact", contactUs);
router.get("/stats/users", stats);

export default router;