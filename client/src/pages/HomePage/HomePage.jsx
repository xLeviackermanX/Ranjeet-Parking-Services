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
      const response = await fetch("/api/private", {
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
    <div style={{width:"100%", justifyContent: "center", overflowY: "scroll", overflowX: "hidden"}}>
      <div style={{width:"100%", height: "600px",backgroundColor: "white", display: "flex", justifyContent: "center", overflowX: "hidden"}}>
        <img alt="Ranjeet Parking Services" width="800px" height="100%" src={IMAGES.homePic}></img>
      </div>
      <div style={{display: "flex", justifyContent: "center", marginTop:"100px"}}>
        <h1 style={{color: "blue"}}>
          Welcome to <Typewriter text="Ranjeet Parking Services...." delay={200} infinite />
        </h1>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <img alt="for more information" width="50px" height="100px" src={IMAGES.scrollIcon}></img>
      </div>
      <div style={{display: "flex", marginTop:"200px"}}>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" src={IMAGES.homePic} alt="Card image cap" />
            <CardBody>
              <CardTitle style={{ fontWeight: "bold" }}>3D</CardTitle>
              <CardText>web application</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter>
          </Card>
        </div>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" src={IMAGES.homePic} alt="Card image cap" />
            <CardBody>
              <CardTitle style={{ fontWeight: "bold" }}>3D</CardTitle>
              <CardText>web application</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter>
          </Card>
        </div>
        <div class="col-4">
          <Card
            style={{
              padding: "5px"
            }}
          >
            <CardImg top width="100%" src={IMAGES.homePic} alt="Card image cap" />
            <CardBody>
              <CardTitle style={{ fontWeight: "bold" }}>3D</CardTitle>
              <CardText>web application</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-muted">Last updated 1 ago</small>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
};

export default HomePage;
