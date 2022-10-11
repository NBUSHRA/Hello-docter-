import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";

export const Login = () => {
    const dispatch = useDispatch()

    const navigate = useNavigate();

    const onFinish = async (values) => {

        try {
            dispatch(showLoading())
            fetch("/api/user/login",
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        dispatch(hideLoading());
                        if (response.success) {
                            toast.success(response.message);
                            localStorage.setItem("token", response.data);
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
        } catch (err) {
            dispatch(hideLoading())
            toast.error("Something went wrong");
        }
    }
    return (
        <div className="authentication">
            <div className="authentication-form card p-3">
                <h1 className="card-title">Please-Login</h1>
                <Form layout="vertical" onFinish={onFinish}>

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
                        LOGIN
                    </Button>
                    <Link to="/register" className="anchor mt-2">
                        CLICK HERE TO REGISTER
                    </Link>
                </Form>
            </div>
        </div>
    );
};
