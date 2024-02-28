import {Vector} from 'two.js/src/vector';
import {SlotList} from '../types/types';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(slots: SlotList, position: Vector): number[] {
    return componentEvents.checkComponentClick(position, slots);
  },
};
