const _global = typeof window === 'undefined' ? global : window;
const CompositeLayer = _global.deck.CompositeLayer;
const ScatterplotLayer = _global.deck.ScatterplotLayer;

export class DemoCompositeLayer extends CompositeLayer {
  renderLayers() {
    return new ScatterplotLayer({
      ...this.props,
      id: this.props.id + 'point',
      data: this.props.data
    });
  }
}
DemoCompositeLayer.layerName = 'DemoCompositeLayer';
