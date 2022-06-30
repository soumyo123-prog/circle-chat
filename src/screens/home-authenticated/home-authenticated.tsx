import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  setDoc
} from 'firebase/firestore';
import { getDistance } from 'geolib';
import {
  DataSnapshot,
  get,
  onDisconnect,
  onValue,
  ref,
  set
} from 'firebase/database';

import Navbar from '../../components/navbar/navbar';
import { useAuth } from '../../context/auth';
import { useLocation } from '../../context/location';
import { database, firestore } from '../../context/firebase';
import { GeolibInputCoordinates } from 'geolib/es/types';

export default function HomeAuthenticated() {
  const { user } = useAuth();
  const { setPosition } = useLocation();
  const [users, setUsers] = useState<string[]>([]);

  const getDistanceBetweenCoords = (
    firstLat: number,
    secondLat: number,
    firstLon: number,
    secondLon: number
  ) => {
    const firstCoords: GeolibInputCoordinates = {
      latitude: firstLat,
      longitude: firstLon
    };
    const secondCoords: GeolibInputCoordinates = {
      latitude: secondLat,
      longitude: secondLon
    };
    return getDistance(firstCoords, secondCoords, 1);
  };

  const updateUsersOnLocationChange = async (
    latitude: number,
    longitude: number,
    docSnap: QueryDocumentSnapshot<DocumentData>
  ) => {
    if (docSnap.id === user!.uid) {
      return;
    }
    const distance = getDistanceBetweenCoords(
      latitude,
      docSnap.data().latitude,
      longitude,
      docSnap.data().longitude
    );
    const userStatusSnapshot = await get(
      ref(database, '/status/' + docSnap.id)
    );
    if (
      userStatusSnapshot.exists() &&
      userStatusSnapshot.val().status === 'online' &&
      distance <= 2
    ) {
      const usernameSnapshot = await getDoc(
        doc(firestore, 'usernames', docSnap.id)
      );
      if (usernameSnapshot.exists()) {
        const nearbyUserUsername = usernameSnapshot.data().username;
        setUsers((prevUsers) => {
          if (prevUsers.includes(nearbyUserUsername)) {
            return [...prevUsers];
          }
          return [...prevUsers, nearbyUserUsername];
        });
      }
    }
  };

  const updateUsersOnStatusChange = async (dataSnap: DataSnapshot) => {
    if (!dataSnap.exists()) {
      return;
    }
    if (dataSnap.key! === user!.uid) {
      return;
    }
    const usernameSnapshot = await getDoc(
      doc(firestore, 'usernames', dataSnap.key!)
    );
    if (!usernameSnapshot.exists()) {
      return;
    }
    const nearbyUserUsername = usernameSnapshot.data().username;
    const status = dataSnap.val().status;
    if (status === 'offline') {
      setUsers((prevUsers) => {
        if (!prevUsers.includes(nearbyUserUsername)) {
          return [...prevUsers];
        }
        return [...prevUsers.splice(prevUsers.indexOf(nearbyUserUsername), 1)];
      });
    } else if (status === 'online') {
      setUsers((prevUsers) => {
        if (prevUsers.includes(nearbyUserUsername)) {
          return [...prevUsers];
        }
        return [...prevUsers, nearbyUserUsername];
      });
    }
  };

  useEffect(() => {
    let latitude = 0;
    let longitude = 0;

    navigator.geolocation.watchPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        setDoc(doc(firestore, 'location', user!.uid), {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        toast.error(error.message);
      }
    );

    const unsubscribe = onSnapshot(
      collection(firestore, 'location'),
      (querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          updateUsersOnLocationChange(latitude, longitude, docSnap);
        });
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const statusDatabaseRef = ref(database, '/status/');
    onValue(statusDatabaseRef, (snapshot) => {
      snapshot.forEach((dataSnap) => {
        updateUsersOnStatusChange(dataSnap);
      });
    });
  }, []);

  useEffect(() => {
    const userStatusDatabaseRef = ref(database, '/status/' + user!.uid);
    const connectedRef = ref(database, '.info/connected');
    const isOffline = {
      status: 'offline'
    };
    const isOnline = {
      status: 'online'
    };
    onValue(connectedRef, (snapshot) => {
      if (!snapshot.val()) {
        return;
      }
      onDisconnect(userStatusDatabaseRef)
        .set(isOffline)
        .then(() => {
          set(userStatusDatabaseRef, isOnline);
        });
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-screen w-full mt-5 p-5">
        {users.map((user) => (
          <div className="rounded-md h-24 flex items-center p-1 bg-gray-200 md:w-9/12 w-full min-w- ml-auto mr-auto mb-5">
            <div className="rounded-full h-20 w-20 flex items-center justify-center bg-red-700"></div>
            <div className="p-5 mr-auto">{user}</div>
          </div>
        ))}
      </div>
    </>
  );
}
