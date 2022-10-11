import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Layout } from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertSlice";

export const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/doctor/get-appointments-by-doctor-id", {
      method: 'get',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,},
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(hideLoading());
          if (response.success) {
            setAppointments(response.data);
          }else {
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
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      fetch("/api/doctor/change-appointment-status", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,'Content-Type':'application/json' },
        body: JSON.stringify({ appointmentId : record._id, status: status })
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message);
              getAppointmentsData();
            }else {
              toast.error(response.message);
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};
