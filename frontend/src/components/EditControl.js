import { useCallback, useEffect, useRef } from 'react';
import Draw from 'leaflet-draw';
import {
  useLeafletContext,
  createPathComponent,
  createControlComponent,
} from '@react-leaflet/core';
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

const createEditControl = (props, context) => {
  const { draw, edit, position } = props;
  const options = {
    edit: {
      ...edit,
      featureGroup: context.layerContainer,
    },
  };

  if (draw) {
    options.draw = { ...draw };
  }

  if (position) {
    options.position = position;
  }
  /* return { instance: new leaflet.Circle([50.5, 30.5], { radius: 200 }), context }; */
  return { instance: new leaflet.Control.Draw(options), context };
};

const updateEditControl = (instance, props, prevProps) => {
  if (
    props.draw !== prevProps.draw ||
    props.edit !== prevProps.edit ||
    props.position !== prevProps.position
  ) {
    // const { map } = props.leaflet;
    // instance.remove(map);
    // instance = createDrawElement(props);
    // instance.addTo(map);
    // // Remount the new draw control
    // const { onMounted } = props;
    // onMounted && onMounted(instance);
  }
};

const EditControl = createControlComponent((props) => new Control.Draw(props));

// const EditControl = ({ onCreated, onMounted, ...otherListeners }) => {
//   const { map, layerContainer } = useLeafletContext();
//   const leafletElement = useRef();

//   const onDrawCreate = useCallback(
//     (e) => {
//       layerContainer.addLayer(e.layer);
//       onCreated && onCreated(e);
//     },
//     [layerContainer, onCreated]
//   );

//   useEffect(() => {
//     for (const key in eventHandlers) {
//       map.on(eventHandlers[key], (evt) => {
//         let handlers = Object.keys(eventHandlers).filter(
//           (handler) => eventHandlers[handler] === evt.type
//         );
//         if (handlers.length === 1) {
//           let handler = handlers[0];
//           otherListeners[handler] && otherListeners[handler](evt);
//         }
//       });
//     }

//     map.on(leaflet.Draw.Event.CREATED, onDrawCreate);

//     onMounted && onMounted(this.leafletElement);

//     return () => {
//       map.off(leaflet.Draw.Event.CREATED, onDrawCreate);

//       for (const key in eventHandlers) {
//         if (props[key]) {
//           map.off(eventHandlers[key], otherListeners[key]);
//         }
//       }
//     };
//   }, [map, onMounted, otherListeners, onDrawCreate]);

//   useEffect(() => {
//     const { map } = this.props.leaflet;

//     if (leafletElement.current) {
//       .remove(map);
//     }
//     leafletElement.current = createDrawElement(props);
//     leafletElement.current.addTo(map);

//     // Remount the new draw control
//     const { onMounted } = this.props;
//     onMounted && onMounted(this.leafletElement);
//   }, []);

//   return null;
// };

export default EditControl;
