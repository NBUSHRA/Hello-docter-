import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Layout } from '../components/Layout';
import { hideLoading, showLoading } from '../redux/alertSlice';
import { Table } from 'antd';
import toast from "react-hot-toast";

export const Appointment = () => {

  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());

      fetch("/api/user/get-appointments-by-user-id", {
        method: 'get',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
       })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              setAppointments(response.data);
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
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span>
          {record.doctorInfo.phoneNumber}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    }
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}
