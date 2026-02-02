import { Router } from "express";
const router = Router();
import { check, validationResult } from "express-validator";
import dbg from "debug";
import loginService from "../service/loginService";
const debug = dbg("api:login");

router.post(
	"/login",
	[],
	async (req, res) => {
		//debug(req.body);
		//debug(req.body);
		// Validation block removed to allow legacy passwords
		await loginService(req.body)
			.then((response) => {
				res.send(response);
			})
			.catch((err) => {
				debug(err);
				res.status(500).send({ message: err.msg });
			});
	}
);
export default router;
