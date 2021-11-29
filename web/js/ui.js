import { drawInteraction, modifyInteraction, selectInteraction } from './map';
import db from './db';

document
  .getElementById('editModeCheckbox')
  .addEventListener('change', (event) => {
    drawInteraction.setActive(event.target.checked);
    modifyInteraction.setActive(event.target.checked);
    selectInteraction.setActive(!event.target.checked);
    setEditUIVisible(event.target.checked);
  });

function setEditUIVisible(visible) {
  for (const element of document.getElementsByClassName('edit-mode-only')) {
    if (visible) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}

export function setUser(user) {
  const name = user.name;
  const moneySquareMeters = user.money;

  //converts from m^2 to km^2
  const formattedMoney = (
    moneySquareMeters > 100000 ? moneySquareMeters / 1000000 : moneySquareMeters
  ).toFixed(2);
  const unit = moneySquareMeters > 100000 ? 'km²' : 'm²';
  const moneyText = formattedMoney + ' ' + unit;

  document.getElementById('name').innerText = name;
  document.getElementById('money').innerText = moneyText;
}

export function setArea(area) {
  document.getElementById('markedArea').innerText = area;
}

export async function setSelectedPlot(plot) {
  if (plot) {
    document.getElementById('owner').classList.remove('hidden');
    const owner = await db.getUser(plot.getProperties().userId);
    document.getElementById('ownerName').innerText = owner.name;
    document.getElementById('ownerComment').innerText =
      plot.getProperties().description;
  } else {
    document.getElementById('owner').classList.add('hidden');
  }
}
