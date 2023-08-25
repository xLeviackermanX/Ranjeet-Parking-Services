import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IMAGES from "../../assets"; // Importing images from single "IMAGES" object
import { AuthState } from "../../context/AuthProvider";
import { Notify } from "../../utils";
import Typewriter from "../../components/AnimatedHeading/TypeWriter";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardFooter
} from "reactstrap";

const HomePage = () => {
  const [privateMessage, setPrivateMessage] = useState("");

  const navigate = useNavigate();
  const { auth } = AuthState();

  const fetchPrivateDate = async () => {
    try {
      const response = await fetch("http://65.2.188.171:5000/api/private", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      console.log(data, auth)

      if (data.success) {
        setPrivateMessage(data.data);
        return Notify(data.data, "success");
      } else {
        navigate("/login");
        return Notify("You are not authorized please login", "error");
      }
    } catch (error) {
      localStorage.removeItem("auth");
      navigate("/login");
      return Notify("Internal server error", "error");
    }
  };

  useEffect(() => {
    fetchPrivateDate();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{width:"100%", justifyContent: "center", overflowY: "scroll", overflowX: "hidden"}} className="heading">
      <div style={{width:"100%", height: "400px",backgroundColor: "white", display: "flex", justifyContent: "center", overflowX: "hidden"}}>
        <img alt="Ranjeet Parking Services" width="100%" height="100%" src={IMAGES.homePic}></img>
      </div>
      <div style={{display: "flex", justifyContent: "center", marginTop:"50px"}}>
        <h1 style={{color: "#873e23"}}>
          Welcome to <Typewriter text="Ranjeet Parking Services...." delay={200} infinite />
        </h1>
      </div>
      {/* <div style={{display: "flex", justifyContent: "center"}}>
        <img alt="for more information" width="50px" height="100px" src={IMAGES.scrollIcon}></img>
      </div> */}
      <h1 style={{color: "#873e23", marginTop: "100px", marginLeft: "45%", fontSize:"3vw"}}>Our Services</h1> 
      <div style={{display: "flex", marginTop:"0px", width: "100%"}}>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" height="300px" src={IMAGES.parking} alt="Card image cap" />
            <CardBody style={{height: "100px"}}>
              <CardTitle style={{ fontWeight: "bold",fontSize:"2vw" }}>GOVT & PRIVATE PARKING SERVICE PROVIDER</CardTitle>
              <CardText></CardText>
            </CardBody>
            {/* <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter> */}
          </Card>
        </div>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" height="300px" src={IMAGES.driver} alt="Card image cap" />
            <CardBody style={{height: "100px"}}>
              <CardTitle style={{ fontWeight: "bold", fontSize:"1.7vw" }}>DRIVERS PROVIDE ALL OVER INDIA</CardTitle>
              <CardText></CardText>
            </CardBody>
            {/* <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter> */}
          </Card>
        </div>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" height="300px" src={IMAGES.manpower} alt="Card image cap" />
            <CardBody style={{height: "100px"}}>
              <CardTitle style={{ fontWeight: "bold",fontSize:"1.7vw" }}>MANPOWER PROVIDE IN INDIA</CardTitle>
              <CardText></CardText>
            </CardBody>
            {/* <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter> */}
          </Card>
        </div>
      </div>
      <div style={{marginTop: "100px", border: "solid black 2px", height: "350px"}}>
      <h1 style={{color: "#873e23", marginTop: "40px", marginLeft: "45%", fontSize:"3vw"}}>CONTACT US</h1>
      <ul style={{marginLeft: "20%", fontSize: "1.7vw"}}>
          <li>Address: M/S PARKING SERVICES 609/73 SCHOOL BLOCK MANDAWALI FAZALPUR DELHI -110092</li>
          <li>MOBILE NO: 9818352294, 8810544025</li>
          <li>EMAIL ID: parkingservicesranjeet@gmail.com</li>
      </ul> 
      </div>
    </div>
  )
};

export default HomePage;
