import {Text as TextInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Text implements TextInterface {
  public position: Point2i;
  public label: string;
  public textSize: number;
  public color: string;
  public font: string;
  public selected: boolean;
  public childElements: Set<number>;

  constructor(
    position: Point2i,
    label: string,
    textSize: number = 12,
    color: string = '#000000',
    font: string = 'sans-serif',
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.label = label;
    this.textSize = textSize;
    this.color = color;
    this.font = font;
    this.selected = false;
    this.childElements = children;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const oldFillStyle = ctx.fillStyle;
    ctx.font = `${this.textSize} ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(this.label, this.position.x, this.position.y);
    ctx.fillStyle = oldFillStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) Vector2i.add(this.position, nPos, this.position);
    else this.position = nPos;
  }
}
