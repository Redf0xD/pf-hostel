import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import styles from './RegisterForAdmin.module.css';
import data from '../../data/countries.json';
import { GlobalContext } from '../../GlobalContext/GlobalContext';
import swal from 'sweetalert';

const RegisterForAdmin = ({ modalExterno }) => {
  let url = import.meta.env.VITE_APP_URL;
  let api = import.meta.env.VITE_API;
  let token = localStorage.getItem('tokenProp');

  let sendData = async (valores) => {
    let res = await fetch(`${url}` + '/usuarios', {
      method: 'POST',
      headers: {
        api: `${api}`,
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(valores),
    });
    let res2 = await res.json();

    // console.log('RESPUESTABACK', res2);
  };

  const [formularioEnviado, cambiarFormularioEnviado] = useState(false);
  // const [dataProfile, setDataProfile] = useState({});
  const [modal, setModal] = useState(false);
  const { dataProfile, setDataProfile } = useContext(GlobalContext);

  const handleClick = (e) => {
    e.preventDefault();
    setModal(false);
  };

  let paises = data;

  const [typePw, setTypePw] = useState('password');

  const revealPassword = () => {
    if (typePw === 'password') {
      setTypePw('text');
    } else {
      setTypePw('password');
    }
  };

  return (
    <div className={styles.register}>
      <Formik
        initialValues={{
          name: '',
          lastname: '',
          email: '',
          dni: '',
          typeofdocument: '',
          password: '',
          nationality: '',
          birthdate: '',
          genre: '',
          role: '',
        }}
        validate={(valores) => {
          let errores = {};
          // console.log('pararicky', valores);
          // Validacion nombre
          if (!valores.name || !valores.name.trim()) {
            errores.name = 'Please enter a name';
          } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.name)) {
            errores.name = 'The name can only contain letters and spaces';
          }

          // Validacion lastname
          if (!valores.lastname || !valores.lastname.trim()) {
            errores.lastname = 'Please enter a lastname';
          } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.lastname)) {
            errores.lastname =
              'The lastname can only contain letters and spaces';
          }

          // Validacion DNI
          if (!valores.dni) {
            errores.dni = 'Please complete the field';
          } else if (
            !/^[0-9]{7,20}$/.test(valores.dni) &&
            valores.typeofdocument === 'DNI'
          ) {
            errores.dni =
              'The dni can only contain numbers and need to be 7 or more';
          } else if (
            valores.typeofdocument === 'Passport' &&
            !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/.test(valores.dni)
          ) {
            errores.dni =
              'Passport need to be 8 to 25 characters with letters and numbers';
          } else if (
            valores.typeofdocument === 'Driver License' &&
            !/^[0-9]{7,20}$/.test(valores.dni)
          ) {
            errores.dni = 'Driver License need to be 7 or more numbers';
          }

          // Validacion email
          if (!valores.email) {
            errores.email = 'Please enter a email';
          } else if (
            !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
              valores.email
            )
          ) {
            errores.email =
              'The entered value must be in the format name@example.com';
          }

          // Validacion password
          if (!valores.password) {
            errores.password = 'Please enter a password';
          } else if (
            !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(valores.password)
          ) {
            errores.password =
              'Minimum eight characters, at least one letter and one number:';
          }

          // Validacion type of document
          if (!valores.typeofdocument) {
            errores.typeofdocument = 'Please enter a type of document';
          }

          // Validacion nationality
          if (!valores.nationality) {
            errores.nationality = 'Please enter your nationality';
          }

          // Validacion genre
          if (!valores.genre) {
            errores.genre = 'Please enter a genre';
          }

          // Validacion role
          if (!valores.role) {
            errores.role = 'Please enter a role';
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
          if (birthdate.value) {
            valores.birthdate = formatYmd(new Date(birthdate.value));
          }

          if (!valores.birthdate) {
            errores.birthdate = 'Please enter a birthdate';
          } else if (!(valores.birthdate <= fechaActualFormateada)) {
            errores.birthdate = 'Need to be 18 or more years old';
          } else if (valores.birthdate < '1922-01-01') {
            errores.birthdate = 'You are very old for register';
          }

          return errores;
        }}
        onSubmit={async (valores, { resetForm }) => {
          await sendData(valores);
          resetForm();
          cambiarFormularioEnviado(true);
          swal('Register successfully');
          modalExterno((prev) => !prev);
          setTimeout(
            () => cambiarFormularioEnviado(false),

            5000
          );
        }}
      >
        {({ errors }) => (
          <Form className={styles.formulario}>
            <h2>Register new Admin/Receptionist</h2>
            <div>
              <label htmlFor="name">First Name</label>
              <Field
                className={styles.input}
                type="text"
                id="name"
                name="name"
                placeholder="Put your name"
              />
              <ErrorMessage
                name="name"
                component={() => (
                  <div className={styles.error}>{errors.name}</div>
                )}
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name</label>
              <Field
                className={styles.input}
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Put your lastname"
                // onChange={handleChange}
              />
              <ErrorMessage
                name="lastname"
                component={() => (
                  <div className={styles.error}>{errors.lastname}</div>
                )}
              />
            </div>
            <div>
              <label htmlFor="typeofdocument">Document Type</label>
              <Field className={styles.input} name="typeofdocument" as="select">
                <option value="typeofdocument" id="AF">
                  Elegir opción
                </option>
                <option value="DNI" id="AF">
                  DNI
                </option>
                <option value="Passport" id="AF">
                  Passport
                </option>
                <option value="Driver License" id="AF">
                  Driver License
                </option>
              </Field>
              <ErrorMessage
                name="typeofdocument"
                component={() => (
                  <div className={styles.error}>{errors.typeofdocument}</div>
                )}
              />
            </div>
            <div>
              <Field
                className={styles.input}
                type="text"
                id="dni"
                name="dni"
                placeholder="Put your document"
              />
              <ErrorMessage
                name="dni"
                component={() => (
                  <div className={styles.error}>{errors.dni}</div>
                )}
              />
            </div>
            <div>
              <label htmlFor="birthdate">Birthdate</label>
              <Field
                className={styles.input}
                type="date"
                id="birthdate"
                name="birthdate"
              />
              <ErrorMessage
                name="birthdate"
                component={() => (
                  <div className={styles.error}>{errors.birthdate}</div>
                )}
              />
            </div>
            <div>
              <label htmlFor="email">Email (Username)</label>
              <Field
                className={styles.input}
                type="text"
                id="email"
                name="email"
                placeholder="email@gmail.com"
              />
              <ErrorMessage
                name="email"
                component={() => (
                  <div className={styles.error}>{errors.email}</div>
                )}
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className={styles.containerInput}>
              <Field
                className={styles.input}
                type={typePw}
                id="password"
                name="password"
                placeholder="mypassword123"
              />

              <button
                type="button"
                className={styles.buttoneye}
                onClick={revealPassword}
              >
                <i className="bi bi-eye-fill"></i>
              </button>
            </div>
            <ErrorMessage
              name="password"
              component={() => (
                <div className={styles.error}>{errors.password}</div>
              )}
            />
            <div>
              <label htmlFor="nationality">Nationality</label>
              <Field className={styles.input} name="nationality" as="select">
                <option>Select option</option>
                {paises.countries.map((p) => {
                  return <option key={p}>{p}</option>;
                })}
              </Field>
              <ErrorMessage
                name="nationality"
                component={() => (
                  <div className={styles.error}>{errors.nationality}</div>
                )}
              />
            </div>
            <div>
              <label htmlFor="genre">Gender</label>
              <Field className={styles.input} name="genre" as="select">
                <option value="" id="AF">
                  Select option
                </option>
                <option value="Male" id="AF">
                  Male
                </option>
                <option value="Female" id="AF">
                  Female
                </option>
                <option value="Other" id="AF">
                  Other
                </option>
              </Field>
              <ErrorMessage
                name="genre"
                component={() => (
                  <div className={styles.error}>{errors.genre}</div>
                )}
              />
            </div>

            <div>
              <label htmlFor="role">Role</label>
              <Field className={styles.input} name="role" as="select">
                <option value="" id="AF">
                  Select option
                </option>
                <option value="administrador" id="AF">
                  Administrator
                </option>
                <option value="recepcionista" id="AF">
                  Recepcionist
                </option>
                <option value="cliente" id="AF">
                  Client
                </option>
              </Field>
              <ErrorMessage
                name="role"
                component={() => (
                  <div className={styles.error}>{errors.role}</div>
                )}
              />
            </div>

            <button type="submit">Send</button>
            {formularioEnviado && (
              <p className={styles.exito}>Sent succesfully!</p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForAdmin;
