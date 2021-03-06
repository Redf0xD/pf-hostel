import './App.css';
import { useState, useContext } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Prueba from './pages/Prueba/Prueba';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import NewPassword from './components/NewPassword/NewPassword';
import Admin from './pages/Admin/Admin';
import CreateRoom from './components/RoomsAdmin/CreateRoom';
import ListRooms from './components/RoomsAdmin/ListRooms';
import BookingFromReception from './components/BookingFromReception/BookingFromReception';
import { GlobalContext } from './GlobalContext/GlobalContext';

import RegisterForAdmin from './components/RegisterForAdmin/RegisterForAdmin';
import BookingHistory from './components/BookingHistory/BookingHistory';

function App() {
  const { rol, setRol } = useContext(GlobalContext);


  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/changepassword" element={<NewPassword />} />
          <Route path="/listrooms" element={<ListRooms />} />
          <Route path="/bookfromreception" element={<BookingFromReception />} />
          <Route path="/createadmin" element={<RegisterForAdmin />} />
          <Route path="/createroom" element={<CreateRoom />} />
          <Route path="/history" element={<BookingHistory />} />
        </Route>
        <Route path="/reserva" element={<Prueba />} />

        <Route
          path="/admin"
          element={
            <>{rol === 'cliente' ? <Navigate replace to="/" /> : <Admin />}</>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
