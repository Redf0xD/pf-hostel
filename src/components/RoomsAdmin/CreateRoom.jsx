import React, { useEffect, useState } from 'react';
import styles from './CreateRoom.module.css';

export function validate(input, image) {
  let errores = {};

  if (!input.nombre || !input.nombre.trim()) {
    // NOMBRE
    errores.nombre = 'Please enter a room name';
  } else if (!/^[a-zA-Z0-9,.!? ]*$/.test(input.nombre)) {
    errores.nombre = 'The name can only contain letters and spaces';
  }

  if (input.privada === null) {
    // PRIVADA?
    errores.privada = 'Please select room type';
  }

  if (input.banoPrivado === null) {
    //Baño privado?
    errores.banoPrivado = 'Please select with or without private bathroom';
  }

  if (!input.comodidades) {
    // COMODIDADES
    errores.comodidades = 'Please enter room amenities';
  } else if (!/^[a-zA-Z0-9,.!? ]*$/.test(input.comodidades)) {
    errores.comodidades = 'Only letters and spaces';
  }

  if (!input.cantCamas) {
    //CANTCAMAS
    errores.cantCamas = 'Please enter amount of beds';
  } else if (!/^[0-9]*$/.test(input.cantCamas)) {
    errores.cantCamas = 'must be a number';
  }

  if (!input.descripcion) {
    //DESCRIPCION
    errores.descripcion = 'Please enter a room description';
  } else if (!/^[a-zA-Z0-9,.'!? ]*$/.test(input.descripcion)) {
    errores.descripcion =
      'The description can only contain letters, numbers, puntuation and spaces';
  }
  //                  PRECIOSCAMAS
  if (input.preciosCamas.length === 0 && input.privada === false) {
    errores.preciosCamas = 'Please set the price for one night';
  }

  if (input.precioHabitacion === 0 && input.privada === true) {
    //PRECIOHABITACION
    errores.precioHabitacion = 'Please type the price for one night';
  } else if (
    input.privada === true &&
    !/^[0-9,.]*$/.test(input.precioHabitacion)
  );
  //                  IMAGENES
  if (
    !/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])*((\.jpg)|(\.png)|(\.jpeg)|(\.svg))\/?(\.webp)?/.test(
      image
    ) &&
    image?.length > 0
  ) {
    //IMAGEN
    errores.image =
      'URL should start with https and end with (.jpg, .png, .jpeg, .svg or .webp)';
  }

  if (input.imagenes.length < 3) {
    // cambiar 0 por 3
    errores.imagenes = "You need to give at least three valid image URL's";
  }

  return errores;
}

/////////////       SOLO FALTA CORREGIR BUG INPUT IMAGENES

export default function CreateRoom() {
  // if(props?.id){
  //   aqui deberia precargar los imputs con la info de una habitacion ya existente para editarla
  //   y al mismo tiempo crear un flag de que en lugar del post habitacion se genere un patch(update) de la habitacion
  // }
  let [error, setError] = useState({});
  let [image, setImage] = useState('');
  let [bedPrice, setBedPrice] = useState(0);
  const initialState = {
    nombre: '',
    privada: null,
    banoPrivado: null,
    comodidades: '',
    cantCamas: 0,
    descripcion: '',
    preciosCamas: [],
    precioHabitacion: 0,
    imagenes: [],
  };
  let [input, setInput] = useState(initialState);

  useEffect(() => {
    setInput(initialState);
  }, []);

  let handleSubmit = (e) => {
    e.preventDefault();
    let token = localStorage.getItem('tokenProp');
    fetch(`${import.meta.env.VITE_APP_URL}/habitaciones`, {
      method: 'POST',
      headers: {
        api: `${import.meta.env.VITE_API}`,
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    setInput(initialState);
    e.target.reset();
  };

  let handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    let objError = validate({ ...input, [e.target.name]: e.target.value });
    setError(objError);
    // console.log(input);
  };

  let oneImage = (e) => {
    setImage(e.target.value);
    let objError = validate({ ...input }, e.target.value);
    setError(objError);
  };

  let handleImageLoad = (e) => {
    e.preventDefault();
    if (!error.image && image?.length > 0) {
      setInput({ ...input, imagenes: [...input.imagenes, image] });
      let objError = validate({
        ...input,
        imagenes: [...input.imagenes, image],
      });
      setError(objError);
      setImage('');
    }
  };

  let handlePrivateRoom = (e) => {
    if (e.target.value === 'true') {
      setInput({ ...input, privada: true });
      let objError = validate({ ...input, privada: true });
      setError(objError);
    } else if (e.target.value === 'false') {
      setInput({ ...input, privada: false });
      let objError = validate({ ...input, privada: false });
      setError(objError);
    } else {
      setInput({ ...input, privada: null });
      let objError = validate({ ...input, privada: null });
      setError(objError);
    }
  };

  let handlePrivateBathroom = (e) => {
    if (e.target.value === 'true') {
      setInput({ ...input, banoPrivado: true });
      let objError = validate({ ...input, banoPrivado: true });
      setError(objError);
    } else if (e.target.value === 'false') {
      setInput({ ...input, banoPrivado: false });
      let objError = validate({ ...input, banoPrivado: false });
      setError(objError);
    } else {
      setInput({ ...input, banoPrivado: null });
      let objError = validate({ ...input, banoPrivado: null });
      setError(objError);
    }
  };

  let handleBedPriceLoad = (e) => {
    e.preventDefault();
    setInput({ ...input, preciosCamas: [bedPrice] });
    let objError = validate({ ...input, preciosCamas: [bedPrice] });
    setError(objError);
    setBedPrice([]);
  };

  return (
    <div className={styles.formulario}>
      <h2>Create New Room</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label>Room name: </label>
          <input
            type={'text'}
            name={'nombre'}
            onChange={(e) => handleChange(e)}
            placeholder="first name..."
            className={styles.input}
          />
          {error.nombre && <p className={styles.error}>{error.nombre}</p>}
        </div>
        <div>
          <label>Room type: </label>
          <select
            name="privada"
            onChange={(e) => handlePrivateRoom(e)}
            className={styles.input}
          >
            <option value="null">Select...</option>
            <option value="false">Shared</option>
            <option value="true">Private</option>
          </select>
          {error.privada && <p className={styles.error}>{error.privada}</p>}
        </div>
        <div>
          <label>Private bathroom: </label>
          <select
            name="banoPrivado"
            onChange={(e) => handlePrivateBathroom(e)}
            className={styles.input}
          >
            <option value="null">Select...</option>
            <option value="false">Shared</option>
            <option value="true">Private</option>
          </select>
          {error.banoPrivado && (
            <p className={styles.error}>{error.banoPrivado}</p>
          )}
        </div>
        <div>
          <label>Amenities: </label>
          <input
            type={'text'}
            name={'comodidades'}
            onChange={(e) => handleChange(e)}
            placeholder="amenities..."
            className={styles.input}
          />
          {error.comodidades && (
            <p className={styles.error}>{error.comodidades}</p>
          )}
        </div>
        <div>
          <label>Number of beds: </label>
          <input
            type="number"
            name="cantCamas"
            onChange={(e) => handleChange(e)}
            placeholder="number of beds..."
            className={styles.input}
          />
          {error.cantCamas && <p className={styles.error}>{error.cantCamas}</p>}
        </div>
        <div>
          <label>Room description: </label>
          <input
            type={'text'}
            name={'descripcion'}
            onChange={(e) => handleChange(e)}
            placeholder="Type a description..."
            className={styles.input}
          />
          {error.descripcion && (
            <p className={styles.error}>{error.descripcion}</p>
          )}
        </div>
        {input.privada === true && (
          <div>
            {/* precioHabitacion */}
            <label>Room price: </label>
            <input
              type={'number'}
              name={'precioHabitacion'}
              onChange={(e) => handleChange(e)}
              placeholder="Room price..."
              className={styles.input}
            />
            {error.precioHabitacion && (
              <p className={styles.error}>{error.precioHabitacion}</p>
            )}
          </div>
        )}
        {input.privada === false && (
          <div>
            {' '}
            {/* preciosCamas */}
            <label>Bed price: </label>
            <input
              type={'number'}
              name={'preciosCamas'}
              onChange={(e) => setBedPrice(e.target.value)}
              placeholder="Bed price..."
              className={styles.input}
            />
            {bedPrice > 0 && (
              <div className={styles.oneLine}>
                <button
                  onClick={handleBedPriceLoad}
                  className={styles.butoncito}
                >
                  set
                </button>{' '}
                <div> Price seted to: {input?.preciosCamas[0]} </div>
              </div>
            )}
            {error.preciosCamas && (
              <p className={styles.error}>{error.preciosCamas}</p>
            )}
          </div>
        )}
        <div>
          {/* imagenes */}
          <label>Add 3 images: </label>
          <input
            type="text"
            id="imagenes"
            name="imagenes"
            onChange={(e) => oneImage(e)}
            placeholder="paste image url..."
            className={styles.input}
            value={image}
          />
          <div> {input?.imagenes?.length} images added</div>
          {input?.imagenes?.length < 3 && (
            <div className={styles.oneLine}>
              <button onClick={handleImageLoad} className={styles.butoncito}>
                load
              </button>
            </div>
          )}
          {error.image && input?.imagenes?.length < 3 && (
            <p className={styles.error}>{error.image}</p>
          )}
          {error.imagenes && <p className={styles.error}>{error.imagenes}</p>}
        </div>
        <div>
          {!input.cantCamas ||
          error.name ||
          error.privada ||
          error.banoPrivado ||
          error.comodidades ||
          error.cantCamas ||
          error.descripcion ||
          error.precioHabitacion ||
          error.preciosCamas ||
          error.imagenes ? null : (
            <button className={styles.butoncito} type="submit">
              Create
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
