import React, { useState } from 'react'
import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import { Col, Row } from 'antd';
import { Doctor } from '../components/Doctor';
import toast from "react-hot-toast";

export const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading())

      fetch("/api/user/get-all-approved-doctors", {
        method: 'get',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading())
            if (response.success) {
              setDoctors(response.data);
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [])
  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor, index) => (
          <Col span={8} xs={24} sm={24} lg={8} key={index}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  )
}
