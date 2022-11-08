import express, { request } from 'express';
import { landService } from '../service/land-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/country', (_request, response) => {
  landService
    .getAllCountry()
    .then((rows) => response.status(200).send(rows))
    .catch((error) => response.status(500).send(error));
});


router.post('/newcountry', (request, response) => {
  const data = request.body.name;
  landService
    .createCountry(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});

export default router; 