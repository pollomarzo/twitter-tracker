import Draw from 'leaflet-draw';
import isEqual from 'lodash-es/isEqual';

import { MapControl, withLeaflet } from 'react-leaflet';
import leaflet, { Map, Control } from 'leaflet';

const eventHandlers = {
  onEdited: 'draw:edited',
  onDrawStart: 'draw:drawstart',
  onDrawStop: 'draw:drawstop',
  onDrawVertex: 'draw:drawvertex',
  onEditStart: 'draw:editstart',
  onEditMove: 'draw:editmove',
  onEditResize: 'draw:editresize',
  onEditVertex: 'draw:editvertex',
  onEditStop: 'draw:editstop',
  onDeleted: 'draw:deleted',
  onDeleteStart: 'draw:deletestart',
  onDeleteStop: 'draw:deletestop',
};

class EditControl extends MapControl {
  createLeafletElement(props) {
    return createDrawElement(props);
  }

  onDrawCreate = (e) => {
    const { onCreated } = this.props;
    const { layerContainer } = this.props.leaflet;

    layerContainer.addLayer(e.layer);
    onCreated && onCreated(e);
  };

  /* componentDidMount() {
    super.componentDidMount();
    const { map } = this.props.leaflet;
    const { onMounted } = this.props;

    for (const key in eventHandlers) {
      map.on(eventHandlers[key], (evt) => {
        let handlers = Object.keys(eventHandlers).filter(
          (handler) => eventHandlers[handler] === evt.type
        );
        if (handlers.length === 1) {
          let handler = handlers[0];
          this.props[handler] && this.props[handler](evt);
        }
      });
    }

    map.on(leaflet.Draw.Event.CREATED, this.onDrawCreate);

    onMounted && onMounted(this.leafletElement);
  } */

  /* componentWillUnmount() {
    super.componentWillUnmount();
    const { map } = this.props.leaflet;

    map.off(leaflet.Draw.Event.CREATED, this.onDrawCreate);

    for (const key in eventHandlers) {
      if (this.props[key]) {
        map.off(eventHandlers[key], this.props[key]);
      }
    }
  } */

  componentDidUpdate(prevProps) {
    // super updates positions if thats all that changed so call this first
    super.componentDidUpdate(prevProps);

    // If the props haven't changed, don't update
    if (
      isEqual(this.props.draw, prevProps.draw) &&
      isEqual(this.props.edit, prevProps.edit) &&
      this.props.position === prevProps.position
    ) {
      return false;
    }

    const { map } = this.props.leaflet;

    this.leafletElement.remove(map);
    this.leafletElement = createDrawElement(this.props);
    this.leafletElement.addTo(map);

    // Remount the new draw control
    const { onMounted } = this.props;
    onMounted && onMounted(this.leafletElement);

    return null;
  }
}

function createDrawElement(props) {
  const { layerContainer } = props.leaflet;
  const { draw, edit, position } = props;
  const options = {
    edit: {
      ...edit,
      featureGroup: layerContainer,
    },
  };

  if (draw) {
    options.draw = { ...draw };
  }

  if (position) {
    options.position = position;
  }

  return new Control.Draw(options);
}

export default withLeaflet(EditControl);
