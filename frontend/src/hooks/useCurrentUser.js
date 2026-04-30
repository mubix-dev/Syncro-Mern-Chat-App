import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useCurrentUser = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userData) return; 

            try {
                const result = await axios.get(`${serverURL}/api/user/current`, { 
                    withCredentials: true 
                });
                dispatch(setUserData(result.data));
            } catch (error) {
                dispatch(setUserData(null));
                
                if (error.response?.status !== 400 && error.response?.status !== 401) {
                    console.error("Session check failed:", error.message);
                }
            }
        };

        fetchUserData();
    }, [dispatch, userData]); 
};

export default useCurrentUser;