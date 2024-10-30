import React , {createContext , useState , useEffect} from 'react'
import  axios from 'axios'
import Cookies from "js-cookie"

export const GlobalState = createContext()

export const DataProvider = ({children}) => {
  //states:
    // const token = Cookies.get('token');
   
    const [product ,setProduct] = useState();
    const [users , setUsers] = useState();
    const [userInfo , setUserInfo] = useState();
    const token = Cookies.get("token");
    useEffect(() => {
        const getMyOffers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/product/user/getAll" , { headers : {Authorization: `Bearer ${token}`}});
            console.log("Products:", res.data);
            setProduct(res.data);
        } catch (error) {
            console.log(error);
          }
        };
        const getAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/user/all" , { headers : {Authorization: `Bearer ${token}`}});
                console.log("Users:", res.data);
                setUsers(res.data);
            } catch (error) {
                console.log(error);
              }
            };
            const getInfor = async () => {
                try {
                    const res = await axios.get("http://localhost:5000/user/infor" , { headers : {Authorization: `Bearer ${token}`}});
                    console.log("UsersInfor:", res.data);
                    setUserInfo(res.data);
                } catch (error) {
                    console.log(error);
                  }
                };
        getMyOffers();
        getAllUsers();
        getInfor()
      }, [token]);
      


    const state ={
    
    Products : product,
    allUsers : users,
    UserInfor : userInfo
    



}

    return(
    <GlobalState.Provider value={state}>
        {children}
    </GlobalState.Provider>
)
}