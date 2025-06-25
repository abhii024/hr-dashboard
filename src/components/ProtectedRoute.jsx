import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem('token');
    // const isAuth = false;

  return isAuth ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
