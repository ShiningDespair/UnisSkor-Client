import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './RegistirationPage.css';
import { AuthContext } from '../../Helpers/AuthContext';

function RegistirationPage() {
    const [universities, setUniversities] = useState([]);
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const history = useHistory();
    const { setAuthState } = useContext(AuthContext);

    useEffect(() => {
        axios.get("https://uniskor-api-acb533d7fd97.herokuapp.com/universities")
            .then(response => {
                const universityOptions = response.data.map(university => ({
                    value: university.uni_id,
                    label: university.uni_name
                }));
                setUniversities(universityOptions);
            })
            .catch(error => {
                console.error("There was an error fetching the universities!", error);
            });
    }, []);

    const handleClickRegister = (values) => {
        const registerData = {
            ...values,
            uni_id: values.selectedUniversity.value
        };
        axios.post("https://uniskor-api-acb533d7fd97.herokuapp.com/students", registerData)
            .then(() => {
                setVerificationSent(true);
                setTimeout(() => {
                    setVerificationSent(false);
                }, 5000);
            })
            .catch(error => {
                setRegisterError(error.response.data.error);
                setTimeout(() => {
                    setRegisterError('');
                }, 5000);
            });
    };

    const handleClickLogIn = (values) => {
        axios.post("https://uniskor-api-acb533d7fd97.herokuapp.com/students/login", values)
            .then((response) => {
                if (!response.data.error) {
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({status:true});
                }
                setLoginError('');
                const uniId = response.data.student.uni_id;
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    history.push(`/UniversityPage/${uniId}`);
                }, 1000);
            })
            .catch(error => {
                setLoginError("Invalid email or password");
                setTimeout(() => {
                    setLoginError('');
                }, 5000);
            });
    };

    const registerInitialValues = {
        stu_name: "",
        stu_surname: "",
        stu_mail: "",
        stu_phone: "",
        stu_pw: "",
        selectedUniversity: null,
    };

    const loginInitialValues = {
        stu_mail: "",
        stu_pw: "",
    };

    const registerValidationSchema = Yup.object().shape({
        stu_name: Yup.string().max(50, "İsim en fazla 50 karakter olabilir").required("İsim boş bırakılamaz"),
        stu_surname: Yup.string().max(50, "Soyisim en fazla 50 karakter olabilir").required("Soyisim boş bırakılamaz"),
        stu_mail: Yup.string().email("Geçerli bir mail giriniz").max(100, "Geçerli bir mail giriniz").required("Üniversitenizin size atadığı öğrenci mailini giriniz"),
        stu_phone: Yup.string().max(14, "Telefon Numaranızı 05XX XXX XX XX şeklinde girebilirsiniz"),
        stu_pw: Yup.string().min(8, "Şifre en az 8 haneli olmalıdır").required("Şifre giriniz"),
        selectedUniversity: Yup.object().nullable().required('Lütfen bir üniversite seçiniz'),
    });

    const loginValidationSchema = Yup.object().shape({
        stu_mail: Yup.string().email("Geçerli bir mail giriniz").max(100, "Geçerli bir mail giriniz").required("Üniversitenizin size atadığı öğrenci mailini giriniz"),
        stu_pw: Yup.string().min(8, "Şifre en az 8 haneli olmalıdır").required("Şifre giriniz"),
    });

    return (
        <div className="body">
            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 className="mb-0 pb-3"><span>Giriş Yap </span><span>Kayıt Ol</span></h6>
                                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                                <label htmlFor="reg-log"></label>
                                <div className="card-3d-wrap mx-auto">
                                    <div className="card-3d-wrapper">
                                        <div className="card-front">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="pb-3">Giriş Yap</h4>
                                                    <Formik initialValues={loginInitialValues} onSubmit={handleClickLogIn} validationSchema={loginValidationSchema}>
                                                        {({ errors, touched }) => (
                                                            <Form>
                                                                <div className="form-group">
                                                                    <Field className="form-style" name="stu_mail" placeholder="Okul Maili" />
                                                                    <i className="input-icon uil uil-at"></i>
                                                                    {errors.stu_mail && touched.stu_mail && <div className="alert">{errors.stu_mail}</div>}
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <Field type="password" className="form-style" name="stu_pw" placeholder="Şifre" />
                                                                    <i className="input-icon uil uil-lock-alt"></i>
                                                                    {errors.stu_pw && touched.stu_pw && <div className="alert">{errors.stu_pw}</div>}
                                                                </div>
                                                                <button type="submit" className="btn mt-4">Giriş Yap</button>
                                                                <br /><br />
                                                                {loginError && <div className="alert">{loginError}</div>}
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-back">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-3 pb-3">Kayıt Ol</h4>
                                                    <Formik initialValues={registerInitialValues} onSubmit={handleClickRegister} validationSchema={registerValidationSchema}>
                                                        {({ setFieldValue, setFieldTouched, errors, touched }) => (
                                                            <Form className="form-group">
                                                                <div className="form-group">
                                                                    <Field className="form-style" name="stu_name" placeholder="İsim" />
                                                                    <i className="input-icon uil uil-user"></i>
                                                                    {errors.stu_name && touched.stu_name && <div className="alert">{errors.stu_name}</div>}
                                                                    <Field className="form-style" name="stu_surname" placeholder="Soyisim" />
                                                                    {errors.stu_surname && touched.stu_surname && <div className="alert">{errors.stu_surname}</div>}
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <Field className="form-style" name="stu_phone" placeholder="Telefon Numarası" />
                                                                    <i className="input-icon uil uil-phone"></i>
                                                                    {errors.stu_phone && touched.stu_phone && <div className="alert">{errors.stu_phone}</div>}
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <Field className="form-style" name="stu_mail" placeholder="Okul Maili" />
                                                                    <i className="input-icon uil uil-at"></i>
                                                                    {errors.stu_mail && touched.stu_mail && <div className="alert">{errors.stu_mail}</div>}
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <Select
                                                                        placeholder="Üniversite Seç"
                                                                        options={universities}
                                                                        name="selectedUniversity"
                                                                        onChange={(value) => setFieldValue('selectedUniversity', value)}
                                                                        onBlur={() => setFieldTouched('selectedUniversity', true)}
                                                                    />
                                                                    {errors.selectedUniversity && touched.selectedUniversity && <div className="alert">{errors.selectedUniversity}</div>}
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <Field type="password" className="form-style" name="stu_pw" placeholder="Şifre" />
                                                                    <i className="input-icon uil uil-lock-alt"></i>
                                                                    {errors.stu_pw && touched.stu_pw && <div className="alert">{errors.stu_pw}</div>}
                                                                </div>
                                                                <button type="submit" className="btn mt-4">Kayıt Ol</button>
                                                                <br /><br /><br />
                                                                {registerError && <div className="alert">{registerError}</div>}
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="loading-modal">
                    <div className="loading-content">
                        <p>Giriş Başarılı. Üniversite sayfanıza yönlendiriliyorsunuz...</p>
                    </div>
                </div>
            )}

            {registered && (
                <div className="loading-modal">
                    <div className="loading-content">
                        <p>Kayıt Başarılı. Giriş sayfasına yönlendiriliyorsunuz...</p>
                    </div>
                </div>
            )}

            {verificationSent && (
                <div className="loading-modal">
                    <div className="loading-content">
                        <p>Kayıt başarılı. E-posta adresinizi doğrulamak için e-postanızı kontrol edin.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegistirationPage;
