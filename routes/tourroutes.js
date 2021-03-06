const express = require("express");
const router = express.Router();

const { creatTour, getTours,
         getTour, updateTour, 
         deleteTour, top5, getStat, 
        getMonthlyPlan } = require("../controllers/tourController");

router.post('/newTour', creatTour);
router.get('/tours', getTours);
router.get('/stats', getStat);
router.get('/plan/:year', getMonthlyPlan);
router.get('/top5', top5, getTours);
router.get('/:id', getTour);
router.put('/:id', updateTour );
router.delete('/:id', deleteTour);














module.exports = router;