import { drawInteraction, modifyInteraction, selectInteraction } from './map';

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
  const money = user.money;

  document.getElementById('name').innerText = name;
  document.getElementById('money').innerText = money;
}

export function setArea(area) {
  document.getElementById('markedArea').innerText = area;
}
