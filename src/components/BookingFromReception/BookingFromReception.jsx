import React, { useContext, useEffect, useState } from 'react';
import styles from './BookingFromReception.module.css';
import countries from '../../data/countries.json';
import { GlobalContext } from '../../GlobalContext/GlobalContext';
import swal from 'sweetalert';

export function validate(input, toBack) {
  /////// VALIDACiONES /////////////////////////////////
  let errores = {};

  //   Name
  if (!input.name) {
    errores.name = 'Please enter a name';
  } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(input.name)) {
    errores.name = 'The name can only contain letters and spaces';
  }

  // Validacion lastname
  if (!input.lastName) {
    errores.lastName = 'Please enter a lastname';
  } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(input.lastName)) {
    errores.lastName = 'The lastname can only contain letters and spaces';
  }

  // gender
  if (!input.gender) {
    errores.gender = 'Please select a gender';
  }

  // Validacion DNI
  if (!input.docNumber) {
    errores.docNumber = 'Please enter a dni';
  } else if (!/^[0-9]{8,20}$/.test(input.docNumber)) {
    errores.docNumber = 'The dni can only contain numbers';
  }

  // Validacion correo
  if (!input.email) {
    errores.email = 'Please enter a email';
  } else if (
    !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(input.email)
  ) {
    errores.email = 'The entered value must be in the format name@example.com';
  }

  // Validacion documento tipo
  if (!input.docType) {
    errores.docType = 'Please select a document type';
  }

  // Validacion nationality
  if (!input.nationality) {
    errores.nationality = 'Please enter your nationality';
  }

  const today = new Date();
  if (!input.checkIn) {
    errores.checkIn = 'Please enter checkIn date';
  } else if (input.checkIn < today.toLocaleDateString('en-CA')) {
    errores.checkIn = 'CheckIn cant be in the past';
  }

  if (!input.checkOut) {
    errores.checkOut = 'Please enter checkOut date';
  } else if (input.checkOut <= input.checkIn) {
    errores.checkOut = 'Checkout has to be after checkIn';
  }

  if (!input.roomIds) {
    errores.roomIds = 'Please select room';
  }

  if (!input.bedQuantity && input.private === false) {
    if (input?.bedQuantity === 0) {
      errores.bedQuantity = 'Please select number of beds';
    } else if (toBack?.camas?.length === 0) {
      errores.bedQuantity =
        'Pleade click add to finish adding the selected beds';
    }
  }

  // Validacion birthdate
  var actual = new Date();

  const [actualMenos18, month, day] = [
    actual.getFullYear() - 18,
    actual.getMonth() + 1,
    actual.getDate(),
  ];
  const array = [actualMenos18, month, day];
  let arrayLindo = new Date(array.join('-'));

  const formatYmd = (date) => date.toISOString().slice(0, 10);

  let fechaActualFormateada = null;
  if (arrayLindo) {
    fechaActualFormateada = formatYmd(arrayLindo);
  }
  if (birthDate.value) {
    input.birthDate = formatYmd(new Date(birthDate.value));
  }

  if (!input.birthDate) {
    errores.birthDate = 'Please enter a birthdate';
  } else if (!(input.birthDate <= fechaActualFormateada)) {
    errores.birthDate = 'Need to be 18 or more years old';
  }

  return errores;
}

const Booking = () => {
  const {
    filteredAvailableBeds, ////// Global Context Imports ////////////////////////////////
    allRooms,
    dataForCardsCopy,
    dataForCards,
    setDataForCards,
    getAllRooms,
    getFilteredBeds,
    genDataForCards,
  } = useContext(GlobalContext);
  let initialState = {
    /////// Inputs initial state ///////////////////////
    name: '',
    lastName: '',
    docType: '',
    docNumber: '',
    birthDate: '',
    nationality: '',
    email: '',
    roomIds: 0,
    bedQuantity: 0,
    checkIn: '',
    checkOut: '',
    private: '',
    totalBeds: [],
    price: 0,
  };
  const [input, setInput] = useState(initialState);
  let initialToBack = {
    camas: [],
    habitaciones: [],
    saldo: 0,
    ingreso: '',
    egreso: '',
    nombre: '',
    apellido: '',
    tipoDoc: '',
    numDoc: '',
    fechaNac: '',
    nacionalidad: '',
    email: '',
    genero: '',
  };
  const [toBack, setToBack] = useState(initialToBack);
  let [error, setError] = useState({}); ////////  Mensajes de error //////////////////////

  useEffect(() => {
    allRooms.length === 0 && getAllRooms(); // trae todas las habitaciones existentes ////////////////////
  }, [allRooms]);

  useEffect(() => {
    filteredAvailableBeds?.length > 0 && genDataForCards(); // HandleClick carga filteredAvailableBeds y genDataForCards arma lista de habitaciones disponibles /////////////
  }, [filteredAvailableBeds]);

  // useEffect(()=>{
  //   console.log('input --> ', input)
  // },[input])

  // useEffect(()=>{
  //   console.log('toBack --> ', toBack)
  // },[toBack])

  // useEffect(()=>{
  //   console.log('dataforCards --> ', dataForCards)
  // },[dataForCards])

  const handleRoomSelect = (e) => {
    // carga id de habitacion seleccionada y carga en input.totalbeds la cantidad de camas para renderizar en el formulario ///////////////////////
    if (e.target.value === 'noRoom') {
      setInput({ ...input, private: true, roomIds: 0, price: 0 });
      let objError = validate(
        { ...input, [e.target.name]: e.target.value },
        toBack
      );
      setError(objError);
    } else {
      let id = Number(e.target.value);
      let aux = dataForCards.filter((r) => r.id === id);
      if (aux[0].privada === true) {
        setInput({
          ...input,
          private: true,
          roomIds: id,
          price: aux[0].precio,
        });
        let objError = validate(
          { ...input, private: true, [e.target.name]: e.target.value },
          toBack
        );
        setError(objError);
      } else {
        let aux2 = [];
        let i = 1;
        aux[0]?.bedIds.forEach((c) => {
          aux2.push(i);
          i++;
        });
        setInput({
          ...input,
          private: false,
          roomIds: id,
          totalBeds: [...aux2],
          price: aux[0].precio / aux[0].totalBeds,
        });
        let objError = validate(
          { ...input, private: false, [e.target.name]: e.target.value },
          toBack
        );
        setError(objError);
      }
    }
  };

  let handleChange = (e) => {
    // valida todos los inputs y carga mensajes de error //////////////////
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    let objError = validate(
      { ...input, [e.target.name]: e.target.value },
      toBack
    );
    setError(objError);
  };

  const handleClick = (e) => {
    // una vez seleccionadas las fechas trae la disponibilidad entre esas fechas ////////////
    e.preventDefault();
    getFilteredBeds(input.checkIn, input.checkOut); //esto nos carga filteredAvailableBeds
  };

  const handleAddBed = (e) => {
    // manda al carrito las habitaciones o camas seleccionadas ///////////////////
    e.preventDefault();
    let aux = [];
    if (input.bedQuantity > 0 && input.private === false) {
      let empty = false;
      let position = undefined;
      let localData = [...dataForCards];
      localData.forEach((r) => {
        if (r.id === input.roomIds) {
          aux = r.bedIds.splice(0, input.bedQuantity);
          r.cantCamas = r.cantCamas - input.bedQuantity;
          if (r.bedIds?.length === 0) {
            empty = true;
          }
          position = localData.indexOf(r);
        }
      });
      if (empty == true) {
        localData.splice(position, 1);
      }
      let aux2 = aux.map((c) => {
        return c.camaId;
      });
      setDataForCards([...localData]);
      setToBack({
        ...toBack,
        camas: [...toBack.camas, ...aux2],
        saldo: toBack.saldo + input.price * aux2.length,
      });
      setInput({
        ...input,
        roomIds: 0,
        price: 0,
        totalBeds: input.totalBeds.slice(
          0,
          input.totalBeds.length - input.bedQuantity
        ),
        bedQuantity: 0,
      });
    } else if (input.roomIds > 0 && input.private === true) {
      let localAux = dataForCards.filter((r) => r.id !== input.roomIds);
      setDataForCards([...localAux]);
      setToBack({
        ...toBack,
        habitaciones: [...toBack.habitaciones, input.roomIds],
        saldo: toBack.saldo + input.price,
      });
      // setInput({...input, roomIds: 0, price: 0})
    }
    // console.log('toback --> ', toBack)
    // console.log('errores --> ', error)
  };

  const handleSubmit = (e) => {
    // manda al back la data completa de la reserva  y resetea al estado inicial los inputs y el carrito ///////////
    e.preventDefault();
    if (toBack.camas?.length === 0 && toBack.habitaciones?.length === 0) {
      swal('Please finish adding selected bed or room');
    } else {
      let paraConsologuear = {
        camas: [...toBack.camas],
        habitaciones: [...toBack.habitaciones],
        ingreso: input.checkIn,
        egreso: input.checkOut,
        nombre: input.name,
        apellido: input.lastName,
        tipoDoc: input.docType,
        numDoc: input.docNumber,
        fechaNac: input.birthDate,
        nacionalidad: input.nationality,
        email: input.email,
        genero: input.gender,
        saldo: toBack.saldo,
      };
      // console.log('POST AL BACK desde submit -->', paraConsologuear)
      let token = localStorage.getItem('tokenProp');
      fetch(`${import.meta.env.VITE_APP_URL}/reservas/recepcion`, {
        method: 'POST',
        headers: {
          api: `${import.meta.env.VITE_API}`,
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camas: [...toBack.camas],
          habitaciones: [...toBack.habitaciones],
          ingreso: input.checkIn,
          egreso: input.checkOut,
          nombre: input.name,
          apellido: input.lastName,
          tipoDoc: input.docType,
          numDoc: input.docNumber,
          fechaNac: input.birthDate,
          nacionalidad: input.nationality,
          email: input.email,
          genero: input.gender,
          saldo: toBack.saldo,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
      setInput(initialState);
      setToBack(initialToBack);
      e.target.reset();
    }
  };

  return (
    <div className={styles.allcss}>
      <div className={styles.formulario}>
        <h2>Booking</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => handleChange(e)}
              placeholder="first name..."
              className={styles.input}
            />
            {error.name && <p className={styles.error}>{error.name}</p>}
          </div>

          <div>
            <label>Last Name: </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={(e) => handleChange(e)}
              placeholder="last name..."
              className={styles.input}
            />
            {error.lastName && <p className={styles.error}>{error.lastName}</p>}
          </div>
          <div>
            <label>Gender: </label>
            <select
              name="gender"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            >
              <option value="">select</option>
              <option value="Male">male</option>
              <option value="Female">female</option>
              <option value="Other">other</option>
            </select>
            {error.gender && <p className={styles.error}>{error.gender}</p>}
          </div>

          <div>
            <label>Document type: </label>
            <select
              name="docType"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            >
              <option value="docType">Elegir opción</option>
              <option value="DNI">DNI</option>
              <option value="Passport">Passport</option>
              <option value="Driver License">Driver License</option>
            </select>
            {error.docType && <p className={styles.error}>{error.docType}</p>}
          </div>
          <div>
            <label>Document Number: </label>
            <input
              type="text"
              id="docNumber"
              name="docNumber"
              onChange={(e) => handleChange(e)}
              placeholder="document number..."
              className={styles.input}
            />
            {error.docNumber && (
              <p className={styles.error}>{error.docNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthDate">Birth date</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            />
            {error.birthDate && (
              <p className={styles.error}>{error.birthDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="email">Email </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => handleChange(e)}
              placeholder="email@mail.com..."
              className={styles.input}
            />
            {error.email && <p className={styles.error}>{error.email}</p>}
          </div>

          <div>
            <label htmlFor="nationality">Nationality</label>
            <select
              name="nationality"
              as="select"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            >
              <option value="">select country...</option>
              {countries?.countries &&
                countries?.countries.map((c) => (
                  <option key={c} value={c} id={c}>
                    {c}
                  </option>
                ))}
            </select>
            {error.nationality && (
              <p className={styles.error}>{error.nationality}</p>
            )}
          </div>

          <div>
            <label htmlFor="checkIn">Check-In</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            />
            {error.checkIn && <p className={styles.error}>{error.checkIn}</p>}
            <label htmlFor="checkOut">Check-Out</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            />
            {error.checkOut && <p className={styles.error}>{error.checkOut}</p>}
            <button
              className={styles.butoncito}
              onClick={(e) => handleClick(e)}
            >
              Get available
            </button>
          </div>

          <div>
            {dataForCards?.length ? (
              <>
                <label htmlFor="roomIds">Room Name</label>
                <select
                  name="roomIds"
                  onChange={(e) => handleRoomSelect(e)}
                  className={styles.input}
                >
                  <option value="noRoom">select</option>
                  {dataForCards?.length &&
                    dataForCards?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                </select>
                {error.roomIds && (
                  <p className={styles.error}>{error.roomIds}</p>
                )}
                {input?.private === false ? ( // si la habitacion elegida es compartida mostrar este input y con la cantidad de camas correcta
                  <div>
                    <label htmlFor="bedQuantity">Bed </label>
                    <select
                      name="bedQuantity"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="bedQuantity">Select bed</option>
                      {input?.totalBeds?.length &&
                        input?.totalBeds.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                    </select>
                    {error.bedQuantity && (
                      <p className={styles.error}>{error.bedQuantity}</p>
                    )}
                  </div>
                ) : null}

                <button
                  className={styles.butoncito}
                  onClick={(e) => handleAddBed(e)}
                >
                  Add to booking
                </button>
              </>
            ) : null}
          </div>
          <p>
            Booking: {toBack?.camas?.length} beds and{' '}
            {toBack?.habitaciones?.length} private rooms
          </p>
          <p>Total to pay: $ {toBack?.saldo}</p>
          {(!toBack?.camas?.length && !toBack?.habitaciones?.length) ||
          !input.name ||
          error.name ||
          error.lastName ||
          error.docType ||
          error.docNumber ||
          error.birthDate ||
          error.nationality ||
          error.email ||
          error.gender ||
          // error.roomIds ||
          error.bedQuantity ||
          error.private ||
          // error.totalBeds ||
          error.checkOut ||
          error.checkIn ? null : (
            <button type="submit">send</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Booking;
