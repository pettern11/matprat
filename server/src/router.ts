import express from 'express';
import { service } from './services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/', (_request, response) => {
  service
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
