import { Router } from "express";
const router = Router();
import dbg from "debug";
const debug = dbg("api:history");
import historyService from "../service/historyService";

router.get("/history", async (req, res) => {
    await historyService(req.headers.authorization)
        .then((response) => {
            debug(response);
            res.send(response);
        })
        .catch((err) => {
            debug(err);
            res.status(500).send({ success: false, message: err });
        });
});

export default router;
