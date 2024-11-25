import { useDispatch, useSelector } from "react-redux";
import { toggleLayer } from "../app-slice";

export function LayersPane() {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.app.layers);

  return (
    <div
      id="layers-pane"
      className="position-absolute bg-light rounded p-2 overflow-auto"
      style={{
        bottom: 70,
        zIndex: 99,
        maxHeight: "43%",
        maxWidth: "50%",
      }}
    >
      {layers.map((layer) => {
        return (
          <div className="pl-5 form-check">
            <input
              className="form-check-input position-relative"
              type="checkbox"
              id={layer.name}
              value=""
              checked={layer.visible}
              onClick={() => {
                dispatch(toggleLayer(layer.name));
              }}
            />
            <label
              className="form-check-label position-relative"
              for={layer.name}
            >
              {layer.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
