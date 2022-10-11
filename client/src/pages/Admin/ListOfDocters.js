import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {Layout} from '../../components/Layout';
import { showLoading, hideLoading } from "../../redux/alertSlice";
import {toast} from 'react-hot-toast'
import { Table } from "antd";
import moment from 'moment';

export const ListOfDocters = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/admin/get-all-doctors", {
      method: 'get',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,'Content-Type':'application/json' }
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(hideLoading());
          if (response.success) {
            setDoctors(response.data);
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

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      fetch("/api/admin/change-doctor-account-status", {
      method: 'post',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,'Content-Type':'application/json' },
      body:JSON.stringify({ doctorId: record._id, userId: record.userId, status: status })
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(hideLoading());
          if (response.success) {
            toast.success(response.message);
            getDoctorsData();
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
      toast.error('Error changing doctor account status');
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];
  return (
   <Layout>
       <h1 className='page-header'> Doctors List</h1>
       <hr />
      <Table columns={columns} dataSource={doctors} />
   </Layout>
  )
}
