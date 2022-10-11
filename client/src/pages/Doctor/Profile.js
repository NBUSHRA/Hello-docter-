import React, { useEffect, useState } from "react";
import { DoctorForm } from "../../components/DoctorForm";
import { Layout } from "../../components/Layout";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      fetch("/api/doctor/update-doctor-profile", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        })
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message);
              navigate("/");
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
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/doctor/get-doctor-info-by-user-id", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: params.userId, })
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              setDoctor(response.data);
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

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
};
