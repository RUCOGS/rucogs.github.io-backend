const { createSVGWindow } = require('svgdom');
const window = createSVGWindow();
import { registerWindow, SVG } from '@svgdotjs/svg.js';
registerWindow(window, window.document);

export const ShapeUtil = {
  drawCircle(width: number, height: number) {
    var circleDraw = SVG().size(width, height);

    circleDraw.clear();
    circleDraw.viewbox(0, 0, width, height);
    circleDraw
      .circle(width)
      .cx(Math.abs(width / 2))
      .cy(Math.abs(width / 2));

    return circleDraw.svg();
  },
};
