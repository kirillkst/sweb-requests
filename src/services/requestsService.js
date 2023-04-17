import useHttp from "../hooks/useHttp";
import { API_URL } from "../utils/constants";


const useRequestsService = () => {
    const { request, process, setProcess } = useHttp();

    const getRequests = async (page) => {
        return await request(`${API_URL}/get/page/${page}`);
    };   

    const deleteRequest = async (id) => {
        return await request(`${API_URL}/delete/id/${id}`, 'DELETE' );
    };

    return { getRequests, deleteRequest, process, setProcess }
};

export default useRequestsService;
