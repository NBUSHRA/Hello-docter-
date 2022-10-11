import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {Layout} from '../../components/Layout';
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { Table } from "antd";
import moment from 'moment';
import {toast} from 'react-hot-toast'

export const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/admin/get-all-users", {
      method: 'get',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,},
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(hideLoading());
          if (response.success) {
            setUsers(response.data);
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

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];
  return (
   <Layout>
       <h1 className='page-header'> User List</h1>
       <hr />
      <Table columns={columns} dataSource={users}/>
   </Layout>
  )
}
