import { useState, useEffect } from 'react';
import React from 'react';
import Cart from '../../components/Cart/Cart';
import Register from '../../components/Register/Register';
import styles from '../../components/Register/Register.module.css';
import Login from '../../components/Login/Login';
import Google from '../../components/Google/Google';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookingFromReception from '../../components/BookingFromReception/BookingFromReception';
import CreateRoom from '../../components/RoomsAdmin/CreateRoom';
import Avatar from '../../components/Avatar/Avatar';
import Stripe from '../../components/Stripe/Stripe';

import RecepTionNavBar from '../../components/ReceptionNavBar/ReceptionNavBar';
import ReceptionFilters from '../../components/ReceptionFilters/ReceptionFilters';
import Calendar from '../../components/Calendar/Calendar';
import NavBar from '../../components/NavBar/NavBar';

import ReceptionNavBar from '../../components/ReceptionNavBar/ReceptionNavBar';
import BookingHistory from '../../components/BookingHistory/BookingHistory';
import InfoUser from '../../components/InfoUser/InfoUser';
import RegisterForAdmin from '../../components/RegisterForAdmin/RegisterForAdmin';

const Prueba = () => {
  return (
    <>
      <InfoUser />
      {/* <Google /> */}
      {/* <RegisterForAdmin /> */}
      <Stripe />
    </>
  );
};

export default Prueba;
