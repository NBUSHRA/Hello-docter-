import React from "react";
import moment from "moment";
import { Layout } from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DoctorForm } from "../components/DoctorForm";

export const ApplyDoctor = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    dispatch(showLoading());
    const payload = {
      ...values,
      userId: user._id,
      timings: [
        moment(values.timings[0]).format("HH:mm"),
        moment(values.timings[1]).format("HH:mm"),
      ],
    }

    fetch("/api/user/apply-doctor-account", {
      method: 'post',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,'Content-Type':'application/json' },
      body: JSON.stringify(payload)
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

  };
  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
};
