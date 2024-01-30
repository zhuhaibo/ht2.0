import { Navigate, Outlet } from 'umi'

export default () => {
    const isLogin = true; //useAuth();
    
    if (isLogin) {
        return <Outlet />;
    } else{
        return <Navigate to="/login" />;
    }
}