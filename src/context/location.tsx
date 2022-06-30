import { createContext, PropsWithChildren, useContext, useState } from 'react';

const LocationContext = createContext<{
  latitude: number;
  longitude: number;
  setPosition: (position: GeolocationPosition) => void;
}>({
  latitude: 0,
  longitude: 0,
  setPosition: (position: GeolocationPosition) => {}
});

export const LocationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const setPosition = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  return (
    <LocationContext.Provider
      value={{
        latitude: latitude,
        longitude: longitude,
        setPosition: setPosition
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
