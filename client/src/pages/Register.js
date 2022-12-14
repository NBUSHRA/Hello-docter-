import React from "react";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
export const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading())

      fetch("/api/user/register", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message);
              navigate('/login')
            } else {
              toast.error(response.message)
            }
          },
          (error) => {
            dispatch(hideLoading());
            toast.error("Something went wrong");
          }
        )
    } catch (err) {
      dispatch(hideLoading())
      toast.error("something went wrong")
    }
  }
  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">HELLO</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            REGISTER
          </Button>
          <Link to="/login" className="anchor mt-2">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
};
