import { Zoom } from "@visx/zoom";
import App from "./App";

const bg = "#f3f3f3";

const initialTransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

export type ZoomIProps = {
  width: number;
  height: number;
};

export default function ZoomItem({ width, height }: ZoomIProps) {
  return (
    <>
      <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => (
          <div className="relative">
            <svg
              width={width}
              height={height}
              style={{
                cursor: zoom.isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              ref={zoom.containerRef}
            >
              <rect width={width} height={height} rx={14} fill={bg} />
              <g transform={zoom.toString()}>
                <App width={width} height={height} />
              </g>
            </svg>
            <div className="controls">
              <button
                type="button"
                className="btn btn-zoom"
                onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-zoom btn-bottom"
                onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
              >
                -
              </button>
              <button
                type="button"
                className="btn btn-lg"
                onClick={zoom.center}
              >
                Center
              </button>
              <button type="button" className="btn btn-lg" onClick={zoom.reset}>
                Reset
              </button>
              <button type="button" className="btn btn-lg" onClick={zoom.clear}>
                Clear
              </button>
            </div>
          </div>
        )}
      </Zoom>
    </>
  );
}
