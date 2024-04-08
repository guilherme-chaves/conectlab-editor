import Vector2 from '@connectlab-editor/types/Vector2';
import {NodeTypeObject, NodeTypes} from '@connectlab-editor/types';
import INPUT_ON from '@connectlab-editor/gates/INPUT_ON.svg';
import INPUT_OFF from '@connectlab-editor/gates/INPUT_OFF.svg';

export const SwitchInput: NodeTypeObject = {
  id: NodeTypes.I_SWITCH,
  imgPath: [INPUT_OFF, INPUT_ON],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'A',
      localPos: new Vector2(70, 25),
    },
  ],
};
