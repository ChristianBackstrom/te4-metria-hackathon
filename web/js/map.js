import { Map, View, Feature } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { Fill, Stroke, Style } from 'ol/style';
import Collection from 'ol/Collection';
import Polygon from 'ol/geom/Polygon';
import { getArea } from 'ol/sphere';
import * as turf from '@turf/turf';

import db from './db';
import { setArea, setUser } from './ui';

// Create map, layers and source

const vectorSource = new VectorSource({ wrapX: true });

const tileLayer = new TileLayer({
  source: new OSM(),
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const map = new Map({
  target: 'map',
  layers: [tileLayer, vectorLayer],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// Fetch user and update UI

let input;
while (!input) {
  input = prompt('Ange ditt användar-ID');
}
const userId = parseInt(input);
const user = await db.getUser(userId);
setUser(user);

// Fetch and draw all plots

const plots = await db.getPlots();

plots.forEach((plot) => {
  const ring = plot.polygon.map((point) => {
    return [point.lng, point.lat];
  });
  ring.push([plot.polygon[0].lng, plot.polygon[0].lat]);

  const polygon = new Polygon([ring]);
  polygon.transform('EPSG:4326', 'EPSG:3857');

  const feature = new Feature({
    geometry: polygon,
    editable: false,
    userId: plot.userId,
    description: plot.description,
    color: plot.color,
  });

  feature.setStyle(
    new Style({
      fill: new Fill({
        color: plot.color + '60',
      }),
      stroke: new Stroke({
        color: plot.color,
        width: 1,
      }),
    })
  );

  vectorSource.addFeature(feature);
});

// Select interaction

export const selectInteraction = new Select();
map.addInteraction(selectInteraction);

// Draw interaction

export const drawInteraction = new Draw({
  source: vectorSource,
  type: 'Polygon',
});
map.addInteraction(drawInteraction);
drawInteraction.setActive(false);

drawInteraction.on('drawend', (event) => {
  const feature = event.feature;
  feature.setProperties({ editable: true });
  editableFeaturesCollection.push(feature);
  updateUIArea(feature);
});

// Modify interaction

const editableFeaturesCollection = new Collection();
export const modifyInteraction = new Modify({
  source: vectorSource,
  features: editableFeaturesCollection,
});
map.addInteraction(modifyInteraction);
modifyInteraction.setActive(false);

// Snap interaction

const snapInteraction = new Snap({ source: vectorSource });
map.addInteraction(snapInteraction);

// Buy button

document.getElementById('buyButton').addEventListener('click', (event) => {
  const latestFeature =
    vectorSource.getFeatures()[vectorSource.getFeatures().length - 1];
  const polygon = latestFeature.getGeometry();
  const polygonCoordinates = polygon
    .clone()
    .transform('EPSG:3857', 'EPSG:4326')
    .getCoordinates()[0]
    .map((point) => {
      return {
        lat: point[1],
        lng: point[0],
      };
    });

  // Validate
  const errorMessage = validate(polygon);
  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  const description = document.getElementById('description').value;
  const color = document.getElementById('color').value;

  const plot = {
    userId: user.id,
    description,
    color,
    polygon: polygonCoordinates,
  };

  db.postPlot(plot);
  db.updateUser(user.id, { money: user.money - getArea(polygon) });

  location.reload();
});

// Other stuff 👍

vectorSource.on('changefeature', (event) => {
  updateUIArea(event.feature);
});

function updateUIArea(feature) {
  const areaSquareMeters = getArea(feature.getGeometry());

  const formattedArea = (
    areaSquareMeters > 100000 ? areaSquareMeters / 1000000 : areaSquareMeters
  ).toFixed(2);
  const unit = areaSquareMeters > 100000 ? 'km²' : 'm²';
  setArea(formattedArea + ' ' + unit);
}

function polygonsIntersect(polygon1, polygon2) {
  const turfPolygon1 = new turf.polygon(polygon1.getCoordinates());
  const turfPolygon2 = new turf.polygon(polygon2.getCoordinates());

  return !!turf.intersect(turfPolygon1, turfPolygon2);
}

function polygonIntersectsAnyOtherFeature(polygon) {
  const otherFeatures = vectorSource.getFeatures();

  for (let i = 0; i < otherFeatures.length; i++) {
    if (otherFeatures[i].getGeometry() == polygon) {
      continue;
    }
    if (polygonsIntersect(polygon, otherFeatures[i].getGeometry())) {
      return true;
    }
  }
  return false;
}

function validate(polygon) {
  if (polygonIntersectsAnyOtherFeature(polygon)) {
    return 'Det markerade området överlappar ett annat område.';
  }
  if (getArea(polygon) < 1) {
    return 'Området måste vara minst 1 m² stort.';
  }
  if (user.money < getArea(polygon)) {
    return 'Du har inte råd med detta område.';
  }
  return;
}

document.getElementById('addMoney').addEventListener('click', (event) => {
  const input = prompt('Hur mycket pengar vill du sätta in?');
  if (input) {
    db.updateUser(user.id, { money: user.money + parseInt(input) });
    location.reload();
  }
});

document.getElementById('name').addEventListener('click', (event) => {
  const input = prompt('Ange ditt namn');
  console.log(user.id, input);
  db.updateUser(user.id, { name: input });
});
