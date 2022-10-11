import React from 'react'
import { useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setUser } from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/alertSlice';

export const ProtectedRoute = (props) => {

  const {user} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = async()=>{
       try{
        dispatch(showLoading())
        fetch("/api/user/get-user-info-by-id", {
          method: 'post',
          headers: {Authorization: `Bearer ${localStorage.getItem("token")}`,},
          body: {
            token: localStorage.getItem("token") 
          }
         })
        .then(res => res.json())
        .then(
        (response) => {

          dispatch(hideLoading());
          if (response.success) {
            dispatch(setUser(response.data));
          } else {
           localStorage.clear()
            navigate("/login");
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          dispatch(hideLoading());
          localStorage.clear()
          navigate("/login");
        }
      )
    }catch(err){
      dispatch(hideLoading());
      localStorage.clear()
      navigate("/login");
    }
  }
  useEffect(()=>{
    if (!user ) {
      getUser();
    }
  },[user])

    if (localStorage.getItem("token")) {
        return props.children;
      } else {
        return <Navigate to="/login" />;
      }
}
