import React, { useCallback, useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../useSocket.js/socket";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import dayjs from "dayjs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);
  const deltaLat = toRad(coord2.lat - coord1.lat);
  const deltaLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

function Create() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 21.1717469, lng: 79.1340581 }); // Initial map center
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const socket = useSocket();
  
  const currentUser = useSelector((state) => state.currentUser);

  const thresholdDistance = 50; // Define threshold in meters

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  // Callback to handle user's location
  const handleUserLocation = useCallback(({ name, _id, roomId, date, position }) => {
    setMarkers((prevMarkers) => {
      const existingMarkerIndex = prevMarkers.findIndex((marker) => marker._id === _id);

      if (existingMarkerIndex !== -1) {
        const updatedMarkers = [...prevMarkers];
        updatedMarkers[existingMarkerIndex].position = position;
        updatedMarkers[existingMarkerIndex].date = date;
        return updatedMarkers;
      } else {
        const newMarker = { name, _id, roomId, date, position };
        return [...prevMarkers, newMarker];
      }
    });

    // Calculate distance between current map center and new marker position
    const distanceFromCenter = calculateDistance(mapCenter, position);
    if (distanceFromCenter > thresholdDistance) {
      // Update map center if the new marker is far enough from the current center
      setMapCenter(position);
    }
  }, [mapCenter]); // Add mapCenter to the dependency array

  useEffect(() => {
    socket.on("handle:user:location", handleUserLocation);
    return () => {
      socket.off("handle:user:location", handleUserLocation);
      socket.emit("admin:exit:location:room", { roomId: currentUser._id });
    };
  }, [socket, handleUserLocation, currentUser._id]);

  const handleAutoClose = () => {
    socket.emit("online:user:location", {
      selectedUsers: selectedUsers,
      roomId: currentUser._id,
    });
    setOpen(false);
  };

  return (
    <Fragment>
      <div className="container" id="map-container">
        <div className="row my-2">
          <div className="col-12 my-2">
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => handleAutoClose()}
              disableCloseOnSelect
              loading={loading}
              value={selectedUsers}
              onChange={(event, newValue) => setSelectedUsers(newValue)}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option, { selected }) => {
                const isSelected = selectedUsers.some((user) => user.name === option.name);
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={isSelected}
                    />
                    {option.name}
                  </li>
                );
              }}
              style={{ width: "80%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Users"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>
        </div>
        <div style={{ height: "75vh", width: "100%" }}>
          {isLoaded ? (
            <GoogleMap
              center={mapCenter} // Set map center dynamically
              zoom={18}
              onClick={() => setActiveMarker(null)}
              mapContainerStyle={{ width: "100%", height: "90vh" }}
            >
              {markers.map(({ _id, name, position, date, imageUrl }) => (
                <MarkerF
                  key={_id}
                  position={position}
                  onClick={() => handleActiveMarker(_id)}
                  icon={{
                    url: imageUrl
                      ? imageUrl
                      : "https://res.cloudinary.com/dvyt63pnb/image/upload/v1726942174/tdpnz9dygc8eewo5myhv.png",
                    scaledSize: { width: 50, height: 50 },
                  }}
                >
                  {activeMarker === _id ? (
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <div>
                        <img
                          src={imageUrl}
                          alt={`${name}'s profile`}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <h4>{name}</h4>
                        <p>Active at: {date}</p>
                      </div>
                    </InfoWindowF>
                  ) : null}
                </MarkerF>
              ))}
            </GoogleMap>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}

export default Create;
