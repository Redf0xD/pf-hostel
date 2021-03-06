import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from '../Button/Button';
import styles from './RoomDetails.module.css';
import { GlobalContext } from '../../GlobalContext/GlobalContext';
import { Modal } from '../Modal/Modal';
import Carousel from '../Carousel/Carousel';
import Loader from '../Loader/Loader';
export default function RoomDetails({ roomId }) {
  const { getIdRoom, details, setDetails } = useContext(GlobalContext);

  useEffect(() => {
    getIdRoom(roomId);
  }, [roomId]);

  return (
    <>
      {!details?.id ? (
        <Loader />
      ) : (
        <div className={styles.roomDetailsContainer}>
          {details?.Imagens?.length ? (
            <Carousel images={details?.Imagens} />
          ) : null}
          <div className={styles.roomDetailsText}>
            <h2>Room: {details?.nombre}</h2>
            {details?.privada ? (
              <p>
                This is a PRIVATE room with beds for {details?.cantCamas}
                people.
              </p>
            ) : (
              <p>This is a SHARED room with {details?.cantCamas} beds.</p>
            )}
            {details?.banoPrivado ? (
              <p>With private bathroom</p>
            ) : (
              <p>With shared bathroom</p>
            )}
            <div>Description: {details?.descripcion}</div>
            <div>Amenities: {details?.comodidades}</div>
          </div>
        </div>
      )}
    </>
  );
}
