import ConnectionComponent from '../components/ConnectionComponent';
import InputComponent from '../components/InputComponent';
import NodeComponent from '../components/NodeComponent';
import OutputComponent from '../components/OutputComponent';
import SlotComponent from '../components/SlotComponent';
import TextComponent from '../components/TextComponent';
import Component from '../interfaces/componentInterface';
import RenderObject, {
  Line,
  Sprite,
  CircleCollision,
  Point,
  RectCollision,
  Text,
  Texture,
  CollisionShape,
} from '../interfaces/renderObjects';
import Point2i from './Point2i';

enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
  INPUT = 5,
  OUTPUT = 6,
}

export enum NodeTypes {
  ADD = 0,
  NAND = 1,
  NOR = 2,
  NOT = 3,
  OR = 4,
  XNOR = 5,
  XOR = 6,
}

export enum InputTypes {
  SWITCH = 0,
}

export enum OutputTypes {
  MONO_LED_OFF = 0,
  MONO_LED_RED = 1,
}

export enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export type ImageListObject = Record<string, ImageBitmap>;

export type NodeList = Map<number, NodeComponent>;

export type SlotList = Map<number, SlotComponent>;

export type ConnectionList = Map<number, ConnectionComponent>;

export type TextList = Map<number, TextComponent>;

export type InputList = Map<number, InputComponent>;

export type OutputList = Map<number, OutputComponent>;

export interface FullComponentList {
  [index: string]: Map<number, Component>;
  nodes: NodeList;
  slots: SlotList;
  connections: ConnectionList;
  texts: TextList;
  inputs: InputList;
  outputs: OutputList;
}

export interface ConnectionVertex {
  type: ComponentType;
  id: number;
}

export interface ConnectionVertices {
  [index: symbol]: ConnectionVertex | undefined;
  start: ConnectionVertex | undefined;
  end: ConnectionVertex | undefined;
}

// Modelo para criação de objetos do tipo NODE
export interface NodeTypeObject {
  readonly id: NodeTypes;
  readonly imgPaths: string[];
  readonly connectionSlot: Array<{
    id: number; // Identificador do slot (0 => inA, 1 => inB, ...)
    name: string; // Nome do slot (adiciona textNode?)
    localPos: Point2i; // Posição do slot, relativo ao elemento-pai
    in: boolean; // Recebe informação de outro elemento (true)
  }>;
  readonly op: (slotState: Array<boolean>) => boolean; // Operação booleana envolvendo o valor atual dos slots
}

export interface InputTypeObject {
  readonly id: InputTypes;
  readonly imgPaths: string[];
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Point2i;
  };
  readonly op: (slotState: Array<boolean>) => boolean;
}

export interface OutputTypeObject {
  readonly id: OutputTypes;
  readonly imgPaths: string[];
  readonly connectionSlot: {
    id: number;
    name: string;
    localPos: Point2i;
  };
  readonly op: (slotState: Array<boolean>) => boolean;
}

export interface SignalGraphData {
  state: boolean;
  signalFrom: Array<number>;
  signalTo: Array<number>;
}

export type SignalGraph = Map<number, SignalGraphData>;

export enum RenderObjectType {
  CIRCLE_COLLISION = 0,
  LINE = 1,
  POINT = 2,
  RECT_COLLISION = 3,
  SPRITE = 4,
  TEXT = 5,
  TEXTURE = 6,
}

export interface RenderGraphData {
  type: RenderObjectType;
  object?: RenderObject;
  line?: Line;
}

export interface RenderGraph {
  [index: string]: Map<number, RenderObject | Line | CollisionShape[]>;
  textures: Map<number, Texture>;
  sprites: Map<number, Sprite>;
  lines: Map<number, Line>;
  texts: Map<number, Text>;
  points: Map<number, Point>;
  rectCollisions: Map<number, RectCollision[]>;
  circleCollisions: Map<number, CircleCollision[]>;
}

export enum RendererType {
  NONE = 0,
  CANVAS = 1,
  // GL2 = 1,
}

export default ComponentType;
