import React from 'react';
import { useContext, useState } from 'react';
import styles from './FilterBar.module.css';
import { GlobalContext } from '../../GlobalContext/GlobalContext.jsx';
import AlertModal from './AlertModal';
import { Modal } from '../Modal/Modal';

const FilterBar = () => {
  const {
    setFilterdates,
    getFilteredBeds,
    allRooms,
    setAllRooms,
    filteredRooms,
    setFileteredRooms,
    dataForCards,
    dataForCardsCopy,
    cart,
  } = useContext(GlobalContext);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [localDate, setLocaldate] = useState({
    checkIn: today.toLocaleDateString('en-CA'),
    checkOut: tomorrow.toLocaleDateString('en-CA'),
  });
  const [localModal, setLocalModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleFilters = (event) => {
    let { name, value } = event.target;
    setLocaldate({ ...localDate, [name]: value });
  };

  const handleClick = () => {
    if (localDate.checkIn < today.toLocaleDateString('en-CA')) {
      setMessage('Check-in date must be today or later.');
      setLocalModal((prevState) => !prevState);
    } else if (localDate.checkOut < localDate.checkIn) {
      setMessage('Check-out date must be after check-in date.');
      setLocalModal((prevState) => !prevState);
    } else {
      if (!cart.length) {
        getFilteredBeds(localDate.checkIn, localDate.checkOut);
        setFilterdates(localDate);
        let checkBathroomBox = document.getElementById('privateBathrooms');
        let selected = document.getElementById('roomTypes');
        let price = document.getElementById('price');
        selected.value = 'All';
        checkBathroomBox.checked = false;
        price.checked = false;
      } else {
        setMessage(
          'Before you can change the dates, you must empty your cart.'
        );
        setLocalModal((prevState) => !prevState);
      }
    }
  };

  const sortPrice = () => {
    let price = document.getElementById('price');

    let data = [];
    let data1 = [];
    if (price.checked == true) {
      data = [...filteredRooms].sort(function (a, b) {
        if (a.privada && !b.privada) {
          return a.precio - b.precio / b.cantCamas; // precios de habritaciónes
        } else if (!a.privada && b.privada) {
          return a.precio / a.cantCamas - b.precio; // precios de habitaciones privadas
        } else if (a.privada && b.privada) {
          return a.precio - b.precio; // precios de habitaciones privadas
        } else {
          return a.precio / a.cantCamas - b.precio / b.cantCamas; // precios de habitaciones privadas
        }
      });
      data1 = [...allRooms].sort(function (a, b) {
        if (a.privada && !b.privada) {
          return a.precio - b.precio / b.cantCamas; // precios de habritaciónes
        } else if (!a.privada && b.privada) {
          return a.precio / a.cantCamas - b.precio; // precios de habitaciones privadas
        } else if (a.privada && b.privada) {
          return a.precio - b.precio; // precios de habitaciones privadas
        } else {
          return a.precio / a.cantCamas - b.precio / b.cantCamas; // precios de habitaciones privadas
        }
      });
    } else {
      data = [...filteredRooms].sort(function (a, b) {
        if (b.privada && !a.privada) {
          return b.precio - a.precio / a.cantCamas; // precios de habritaciónes
        } else if (!b.privada && a.privada) {
          return b.precio / b.cantCamas - a.precio; // precios de habitaciones privadas
        } else if (b.privada && a.privada) {
          return b.precio - a.precio; // precios de habitaciones privadas
        } else {
          return b.precio / b.cantCamas - a.precio / a.cantCamas; // precios de habitaciones privadas
        }
      });
      data1 = [...allRooms].sort(function (a, b) {
        if (b.privada && !a.privada) {
          return b.precio - a.precio / a.cantCamas; // precios de habritaciónes
        } else if (!b.privada && a.privada) {
          return b.precio / b.cantCamas - a.precio; // precios de habitaciones privadas
        } else if (b.privada && a.privada) {
          return b.precio - a.precio; // precios de habitaciones privadas
        } else {
          return b.precio / b.cantCamas - a.precio / a.cantCamas; // precios de habitaciones privadas
        }
      });
    }
    setFileteredRooms(data);
    setAllRooms(data1);
  };

  const handleRooms = () => {
    if (dataForCards.length > 0) {
      let checkBathroomBox = document.getElementById('privateBathrooms');
      let selected = document.getElementById('roomTypes');

      if (selected.value === 'All') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            dataForCardsCopy.filter((room) => room.banoPrivado === true)
          );
        } else {
          setFileteredRooms(dataForCardsCopy);
        }
      } else if (selected.value === 'Private') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            dataForCardsCopy.filter(
              (room) => room.privada === true && room.banoPrivado === true
            )
          );
        } else {
          setFileteredRooms(
            dataForCardsCopy.filter((room) => room.privada === true)
          );
        }
      } else if (selected.value === 'Shared') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            dataForCardsCopy.filter(
              (room) => room.privada === false && room.banoPrivado === true
            )
          );
        } else {
          setFileteredRooms(
            dataForCardsCopy.filter((room) => room.privada === false)
          );
        }
      }
    } else {
      let checkBathroomBox = document.getElementById('privateBathrooms');
      let selected = document.getElementById('roomTypes');
      if (selected.value === 'All') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            allRooms.filter((room) => room.banoPrivado === true)
          );
        } else {
          setFileteredRooms(allRooms);
        }
      } else if (selected.value === 'Private') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            allRooms.filter(
              (room) => room.privada === true && room.banoPrivado === true
            )
          );
        } else {
          setFileteredRooms(allRooms.filter((room) => room.privada === true));
        }
      } else if (selected.value === 'Shared') {
        if (checkBathroomBox.checked == true) {
          setFileteredRooms(
            allRooms.filter(
              (room) => room.privada === false && room.banoPrivado === true
            )
          );
        } else {
          setFileteredRooms(allRooms.filter((room) => room.privada === false));
        }
      }
    }
  };

  return (
    <div className={styles.form} id="form">
      {!!localModal && (
        <Modal setLocalModal={setLocalModal}>
          <AlertModal message={message} />
        </Modal>
      )}
      <label className={styles.input}>
        From:
        <input
          type="date"
          name="checkIn"
          onChange={handleFilters}
          className={styles.data}
          defaultValue={today.toLocaleDateString('en-CA')}
        />
      </label>
      <label className={styles.input}>
        To:
        <input
          type="date"
          name="checkOut"
          onChange={handleFilters}
          className={styles.data}
          defaultValue={tomorrow.toLocaleDateString('en-CA')}
        />
      </label>

      <label className={styles.input}>
        Only Privated Bathroom
        <input type="checkbox" onChange={handleRooms} id="privateBathrooms" />
        <div className={styles.check}>
          <div className={styles.checkText}></div>
        </div>
      </label>
      <label className={styles.input}>
        Order by Price
        <input type="checkbox" onChange={sortPrice} id="price" />{' '}
        <div className={styles.check}>
          <div className={styles.checkPrice}></div>
        </div>
      </label>

      <label className={styles.input}>
        Private Room
        <select onChange={handleRooms} id="roomTypes" className={styles.select}>
          <option value="All">All</option>
          <option value="Private">Private</option>
          <option value="Shared">Shared</option>
        </select>
      </label>
      <button className={styles.button} onClick={handleClick}>
        View available
      </button>
    </div>
  );
};

export default FilterBar;
