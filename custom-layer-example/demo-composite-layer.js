import { CompositeLayer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

export class DemoCompositeLayer extends CompositeLayer {
  renderLayers() {
    return new ScatterplotLayer(this.props);
  }
}
