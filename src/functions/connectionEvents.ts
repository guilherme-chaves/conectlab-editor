import Editor from '../Editor';
import ComponentsList from '../components/ComponentsList';
import Vector2 from '../types/Vector2';
import ComponentType from '../types/types';
import EditorEvents from './events';
import slotEvents from './slotEvents';

export default {
  editingLineId: -1,
  editingLine: false,
  lineStartSlot: -1,
  oldSlotCollision: -1,
  slotCollision: -1,

  // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
  checkConnectionClick(
    componentsList: ComponentsList,
    eventsObject: EditorEvents
  ): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(componentsList.getComponents()['connections']).forEach(key => {
      const keyN = parseInt(key);
      const collision = componentsList
        .getComponents()
        ['connections'][keyN].getCollisionShape()
        .collisionWithPoint(eventsObject.getMousePosition());
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },

  addLine(editor: Editor, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) return true;
    const slotCollisions = slotEvents.checkSlotClick(
      editor.getEnviroment(),
      eventsObject
    );
    if (slotCollisions !== undefined) {
      const key = Object.values(slotCollisions)[0];
      const slot = editor.getEnviroment().getComponents().slots[key];
      const slotPosition = slot.position.add(slot.getParentPosition());
      this.editingLineId = editor.line(slotPosition.x, slotPosition.y, {
        type: ComponentType.SLOT,
        id: key,
      });
      this.editingLine = true;
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = key;
      this.lineStartSlot = key;
      return true;
    } else {
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = -1;
    }
    return false;
  },

  lineMove(
    componentsList: ComponentsList,
    eventsObject: EditorEvents,
    mouseDelta: Vector2
  ) {
    if (
      this.editingLine &&
      this.editingLineId !== -1 &&
      eventsObject.getMouseChangedPosition()
    ) {
      componentsList
        .getComponents()
        .connections[this.editingLineId].changePosition(mouseDelta, 1, true);
      this.bindConnection(componentsList, eventsObject);
      return true;
    }
    return false;
  },

  fixLine(componentsList: ComponentsList, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      // Busca se existe um slot na posição atual do mouse
      const currentSlotCollision = slotEvents.checkSlotClick(
        componentsList,
        eventsObject
      );
      if (
        this.slotCollision !== -1 &&
        currentSlotCollision !== undefined &&
        currentSlotCollision[0] !== this.lineStartSlot
      ) {
        if (
          componentsList
            .getComponents()
            .slots[this.lineStartSlot].getInSlot() ===
          componentsList
            .getComponents()
            .slots[currentSlotCollision[0]].getInSlot()
        ) {
          // Impede conexões entre slots do mesmo tipo
          delete componentsList.getComponents().connections[this.editingLineId];
          this.resetConnEventParams();
          return false;
        } else if (
          !componentsList
            .getComponents()
            .slots[currentSlotCollision[0]].getInSlot()
        ) {
          // Caso a conexão esteja sendo feita de forma inversa (in -> out), trocar o valor dos parâmetros
          const temp = this.lineStartSlot;
          this.lineStartSlot = currentSlotCollision[0];
          currentSlotCollision[0] = temp;
        }

        // Remove uma antiga conexão nos slots inicial e final, se existir, e atribui a nova conexão
        this.removeOldConnection(componentsList, this.lineStartSlot);
        this.removeOldConnection(componentsList, currentSlotCollision[0]);
        componentsList
          .getComponents()
          .slots[this.lineStartSlot].setConnectionId(this.editingLineId);
        componentsList
          .getComponents()
          .slots[currentSlotCollision[0]].setConnectionId(this.editingLineId);

        this.setConnectionParams(
          componentsList,
          componentsList
            .getComponents()
            .slots[this.lineStartSlot].getPosition(true),
          componentsList
            .getComponents()
            .slots[currentSlotCollision[0]].getPosition(true),
          this.lineStartSlot,
          currentSlotCollision[0]
        );

        componentsList
          .getComponents()
          .connections[this.editingLineId].generateCollisionShapes();

        this.resetConnEventParams();
        return true;
      } else {
        delete componentsList.getComponents().connections[this.editingLineId];
        this.resetConnEventParams();
        return false;
      }
    }
    this.resetConnEventParams();
    return false;
  },

  bindConnection(componentsList: ComponentsList, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollided = slotEvents.checkSlotClick(
        componentsList,
        eventsObject
      );
      if (slotCollided !== undefined) {
        // Evitar colisões com o slot de onde a linha se origina
        if (
          componentsList.getComponents().connections[this.editingLineId]
            .connectedTo.start?.id !== slotCollided[0]
        ) {
          const collisionWith =
            componentsList.getComponents().slots[slotCollided[0]];
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = slotCollided[0];
          // A posição do slot é relativa ao seu componente-pai
          const collisionPos = collisionWith.position.add(
            collisionWith.getParentPosition()
          );
          // Fixa a posição da linha para o slot
          componentsList.getComponents().connections[
            this.editingLineId
          ].endPosition = collisionPos;
        }
      } else {
        if (this.slotCollision !== -1) {
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = -1;
        }
        componentsList.getComponents().connections[
          this.editingLineId
        ].endPosition = eventsObject.getMousePosition();
      }
    }
  },
  setConnectionParams(
    componentsList: ComponentsList,
    startPos?: Vector2,
    endPos?: Vector2,
    startSlotId?: number,
    endSlotId?: number
  ) {
    if (startPos !== undefined)
      componentsList
        .getComponents()
        .connections[this.editingLineId].changePosition(startPos, 0, false);
    if (endPos !== undefined)
      componentsList
        .getComponents()
        .connections[this.editingLineId].changePosition(endPos, 1, false);
    if (startSlotId !== undefined)
      componentsList
        .getComponents()
        .connections[this.editingLineId].changeConnection(
          startSlotId,
          ComponentType.SLOT,
          false
        );
    if (endSlotId !== undefined)
      componentsList
        .getComponents()
        .connections[this.editingLineId].changeConnection(
          endSlotId,
          ComponentType.SLOT,
          true
        );
  },
  removeOldConnection(componentsList: ComponentsList, slotId: number) {
    const oldConnectionId = componentsList
      .getComponents()
      .slots[slotId].getConnectionId();
    if (oldConnectionId !== -1) {
      const oldConnection =
        componentsList.getComponents().connections[oldConnectionId];
      componentsList.getComponents().slots[slotId].setConnectionId(-1);
      if (oldConnection.connectedTo.start)
        componentsList
          .getComponents()
          .slots[oldConnection.connectedTo.start.id].setConnectionId(-1);
      if (oldConnection.connectedTo.end)
        componentsList
          .getComponents()
          .slots[oldConnection.connectedTo.end.id].setConnectionId(-1);
      delete componentsList.getComponents().connections[oldConnectionId];
    }
  },
  resetConnEventParams() {
    // Reinicia os parâmetros para evitar ligações acidentais
    this.editingLine = false;
    this.editingLineId = -1;
    this.slotCollision = -1;
    this.oldSlotCollision = -1;
    this.lineStartSlot = -1;
  },
};
