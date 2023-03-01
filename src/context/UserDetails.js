import { createContext, useEffect, useState } from "react";

export const UserDetailsContext = createContext();
export const ChangeUserDetailsContext = createContext();

const UserDetails = ({children}) =>{
    const [userDetails, setUserDetails] = useState({"name": " ","email": " ","phoneNo": " " ,"whatsappNo": " ","countryCode": " ", "passwordHex":" ", "emailVerified":true});
    const changeUserDetails = (name, email, phone, whatsapp, countryCode, passwordHex, emailVerified)=>{
        setUserDetails({
            "name": name || userDetails.name,
            "email": email || userDetails.email,
            "phoneNo": phone || userDetails.phoneNo,
            "whatsappNo": whatsapp || userDetails.whatsappNo,
            "countryCode": countryCode || userDetails.countryCode,
            "passwordHex": passwordHex || userDetails.passwordHex,
            "emailVerified": emailVerified
        })
    }
    // useEffect(()=>{
    //     console.log(userDetails)
    // },[])
    return (
        <UserDetailsContext.Provider value={userDetails}>
            <ChangeUserDetailsContext.Provider value={changeUserDetails}>
                {children}
            </ChangeUserDetailsContext.Provider>
        </UserDetailsContext.Provider>
    )
}
export default UserDetails;