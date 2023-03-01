import { Outlet } from "react-router-dom";
import Navbar from "./NavbarSection/Index"
import FooterSection from './FooterSection/Index'

const Index = () => {
    return (
        <>  
            <Navbar/>
            <Outlet/>
            <FooterSection />
        </>
    );
};

export default Index;
