import { useCookies } from 'react-cookie'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { userApi } from '../Profile/profile.service'
import Loading from '../Loading/Loading'

export default function RequiredRoute() {
    const [cookies] = useCookies(["logged_in"]);
    const location = useLocation();


    const { isLoading, isFetching, data } = userApi.endpoints.getMe.useQuery(null, {
        skip: false,
        refetchOnMountOrArgChange: true,
    });
    
    const loading = isLoading || isFetching;


    if(loading) {
        return (
            <Loading />
        )
    }
    
    

    return (cookies.logged_in || !isFetching && data) ? (
        <Outlet />
    ) : (
        <Navigate to="/admin/login" state={{ from: location }} replace />
    )
}
