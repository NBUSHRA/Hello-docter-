import { Tabs } from 'antd'
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout'
import { hideLoading, showLoading } from '../redux/alertSlice';
import { setUser } from '../redux/userSlice';

export const Notification = () => {

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/user/mark-all-notifications-as-seen", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: user._id})
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message)
              dispatch(setUser(response.data));
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
  }
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      fetch("/api/user/delete-all-notifications", {
        method: 'post',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: user._id})
      })
        .then(res => res.json())
        .then(
          (response) => {
            dispatch(hideLoading());
            if (response.success) {
              toast.success(response.message)
              dispatch(setUser(response.data));
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
  }
  return (
    <Layout>
      <h1 className='page-title'>Notifications</h1>
      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => markAllAsSeen()}>Mark all as seen</h1>
          </div>
          {user?.unseenNotifications.map((notification, i) => (
            <div className='card p-2 mt-2' onClick={() => navigate(notification.onClickPath)} key={i}>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Seen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => deleteAll()} >Delete All</h1>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div className="card p-2 mt-2" onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  )
}
