var express = require('express');
var router = express.Router();

const { Plot, Point } = require('../../../models/');


router.get('/', async (req,res) => {

    const plots = await Plot.findAll({
        include: [{
            model: Point, 
            as: 'polygons',
            attributes: ['lat','lng'],
            order: ['createdAt', 'DESC']
        }],
    });
    

    res.json({
        plots,
    });
});

router.get('/:id', async (req,res) => {

    const plot = await Plot.findByPk(req.params.id, {
        include: [{
            model: Point, 
            as: 'polygons',
            attributes: ['lat','lng'],
            order: ['createdAt', 'DESC']
        }],
    });


    res.json({
        plot,
    });
});


router.post('/', async (req, res) => {
    const plot = await Plot.create({
        userId: req.body.userId,
        description: req.body.description,
        color: req.body.color,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const plotId = plot.dataValues.id;

    const points = req.body.polygon;
    points.forEach((point) => {
        Point.create({
            plotId: plotId,
            lat: point.lat,
            lng: point.lng,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });
    res.status(201).json({
        plotId: plot.id,
    });
});


module.exports = router;