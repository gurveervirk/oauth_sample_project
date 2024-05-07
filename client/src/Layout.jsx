import React, { useState, useContext, useCallback, useEffect } from 'react'
import { Layout, Menu, theme } from "antd"
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from './LandingPage';
import Profile from './Profile';
import axios from 'axios';

export default function LayoutComponent({ AuthContext, CounterContext }) {

    const Counter = () => {
        const { state, dispatch } = useContext(CounterContext);
        const navigate = useNavigate();
      
        const fetchCounter = useCallback(async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/counter');
            if(response.data.count !== state.count || response.data.mycount != state.mycount) dispatch({ type: 'SET', count: response.data.count, mycount:response.data.mycount });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        useEffect(() => {
          fetchCounter();
        }, [fetchCounter]);
      
        const incrementCounter = useCallback(async () => {
          try {
            await axios.post('http://localhost:5000/api/counter/increment');
            dispatch({ type: 'INCREMENT' });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        const decrementCounter = useCallback(async () => {
          try {
            await axios.post('http://localhost:5000/api/counter/decrement');
            dispatch({ type: 'DECREMENT' });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        return (
          <div>
            <h2>Counter</h2>
            <p>Count: {state.count}</p>
            <p>My Count: {state.mycount}</p>
            <button onClick={incrementCounter}>Increment</button>
            <button onClick={decrementCounter}>Decrement</button>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        );
      };
      
      const MyCounter = () => {
        const { state, dispatch } = useContext(CounterContext);
        const navigate = useNavigate();
      
        const fetchCounter = useCallback(async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/counter');
            if(response.data.count !== state.count || response.data.mycount != state.mycount) dispatch({ type: 'SET', count: response.data.count, mycount: response.data.mycount });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        useEffect(() => {
          fetchCounter();
        }, [fetchCounter]);
      
        const incrementMyCounter = useCallback(async () => {
          try {
            await axios.post('http://localhost:5000/api/counter/myincrement');
            dispatch({ type: 'MY_INCREMENT' });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        const decrementMyCounter = useCallback(async () => {
          try {
            await axios.post('http://localhost:5000/api/counter/mydecrement');
            dispatch({ type: 'MY_DECREMENT' });
          } catch (err) {
            console.error(err);
          }
        }, [dispatch]);
      
        return (
          <div>
            <h2>My Counter</h2>
            <p>Count: {state.count}</p>
            <p>My Count: {state.mycount}</p>
            <button onClick={incrementMyCounter}>Increment</button>
            <button onClick={decrementMyCounter}>Decrement</button>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        );
      };

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }

    const items = [
        getItem(
            <NavLink to={`/dashboard`}>
                Dashboard
            </NavLink>,
            'dashboard'
        ),
        getItem(
            <NavLink to={`/profile`}>
                Profile
            </NavLink>,
            'profile'
        ),
        getItem(
            <NavLink to={`/counter`}>
                Counter
            </NavLink>,
            'counter'
        ),
        getItem(
            <NavLink to={`/mycounter`}>
                My Counter
            </NavLink>,
            'mycounter'
        ),
    ];

    const { Header, Content, Footer, Sider } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const mainPathSplit = window.location.pathname.split('/');
    return (
        <div>
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="" >
                        <h1 style={{ color: '#fff', textAlign: 'center' }}>OAuth</h1>
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={mainPathSplit && mainPathSplit[1] ? mainPathSplit[1] : 'dashboard'} mode="inline" items={items} />
                </Sider>
                <Layout>
                    {/* <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    /> */}
                    <Content
                        style={{
                            margin: '0 16px',
                        }}
                    >
                        <Routes>
                            <Route index path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<LandingPage AuthContext={AuthContext} />} />
                            <Route path="/profile" element={<Profile AuthContext={AuthContext} />} />
                            <Route path="/counter" element={<Counter />} />
                            <Route path="/mycounter" element={<MyCounter />} />
                        </Routes>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                            background: colorBgContainer,
                            padding: 15
                        }}
                    >
                        Teleparadigm ©{new Date().getFullYear()}
                    </Footer>
                </Layout>
            </Layout>
        </div>
    )
}
