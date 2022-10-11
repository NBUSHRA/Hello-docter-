import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertSlice";
import moment from "moment";

export const BookAppointment = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/doctor/get-doctor-info-by-id", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: params.doctorId })
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              dispatch(hideLoading());
              if (response.success) {
                setDoctor(response.data);
              }
            } else {
              toast.error(response.message);
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )

    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/user/check-booking-avilability", {
        method: 'post',
        body: JSON.stringify({
          doctorId: params.doctorId,
          date: date,
          time: time,
        }),
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message);
              setIsAvailable(true);
            } else {
              toast.error(response.message);
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());

      fetch("/api/user/book-appointment", {
        method: 'post',
        body: JSON.stringify({
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        }),
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message);
              navigate("/appointments");
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height='400'
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <p>
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit : </b>
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker format="DD-MM-YYYY" onChange={(value) => {
                  setDate(moment(value).format("DD-MM-YYYY"));
                  setIsAvailable(false);
                }} />
                <TimePicker format="HH:mm" className="mt-3" onChange={(value) => {
                  setIsAvailable(false);
                  setTime(moment(value).format("HH:mm"));
                }} />
                {!isAvailable && <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
};
