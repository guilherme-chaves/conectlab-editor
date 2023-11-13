import ComponentType, {nodeTypes} from '../types/types';
import {NodeTypeObject} from '../types/types';
import {
  ADDNode,
  NANDNode,
  NORNode,
  NOTNode,
  ORNode,
  XNORNode,
  XORNode,
} from '../objects/nodeTypeObjects';
import Vector2 from '../types/Vector2';
import BBCollision from '../collision/BBCollision';
import EditorEnvironment from '../EditorEnvironment';
import Component from '../interfaces/componentInterface';
import SlotComponent from './SlotComponent';

class NodeComponent implements Component {
  public readonly id: number;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeTypeObject;
  private _slotComponents: Array<SlotComponent>;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

  get slotComponents() {
    return this._slotComponents;
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponents = value;
  }

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  get image() {
    return EditorEnvironment.nodeImageList[`${this.nodeType.id}`];
  }

  constructor(
    id: number,
    position: Vector2,
    nodeType: nodeTypes,
    canvasWidth: number,
    canvasHeight: number,
    slots: Array<SlotComponent>
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.NODE;
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this._slotComponents = slots;
    this.imageWidth =
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`].width;
    this.imageHeight =
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`].height;
    this._position = this._position.sub(
      new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
    );
    const canvasBound = new Vector2(canvasWidth, canvasHeight);
    canvasBound.sub(new Vector2(this.imageWidth, this.imageHeight));
    this.position = this.position.min(canvasBound).max(Vector2.ZERO);
    this._collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
  }

  static getNodeTypeObject(type: nodeTypes): NodeTypeObject {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case nodeTypes.ADD:
        return ADDNode;
      case nodeTypes.NAND:
        return NANDNode;
      case nodeTypes.NOR:
        return NORNode;
      case nodeTypes.NOT:
        return NOTNode;
      case nodeTypes.OR:
        return ORNode;
      case nodeTypes.XNOR:
        return XNORNode;
      case nodeTypes.XOR:
        return XORNode;
      default:
        return NOTNode;
    }
  }

  move(v: Vector2, useDelta = true): void {
    if (useDelta) {
      this.position = this.position.add(v);
      this.collisionShape.moveShape(v);
    } else {
      this.position = v.sub(
        new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
      );
      this.collisionShape.moveShape(this.position, false);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`],
      this.position.x,
      this.position.y
    );
    if (this.collisionShape !== undefined) this.collisionShape.draw(ctx, true);
  }
}

export default NodeComponent;
