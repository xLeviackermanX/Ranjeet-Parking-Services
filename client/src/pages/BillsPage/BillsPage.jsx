import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../context/AuthProvider";
import { Notify } from "../../utils";
import IMAGES from '../../assets';
// import { Worker } from '@react-pdf-viewer/core';
import axios from "axios";

// import PDFViewer from 'pdf-viewer-reactjs'

import "./BillsPage.css"
const BillsPage = () => {
  const [privateMessage, setPrivateMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth1, setSelectedMonth1] = useState("January");
  const [selectedYear1, setSelectedYear1] = useState(2023);
  const [bills, setBills] = useState([])
  const [fileToOpen, setFileToOpen] = useState([])
  const [openFileUpload, setOpenFileUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const navigate = useNavigate();
  const { auth } = AuthState();
  const [uploadedFile, setUploadedFile] = useState ('');
  const [fileTitle, setFileTitle] = useState ('');
  const [curBills, setCurBills] = useState([])
  const [page, setPage] = React.useState(0);
  // total number of records 
  const [count, setCount] = React.useState(0);
  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "November",
    "December"
  ]
  var years = []
  var curYear = new Date().getFullYear()
  for(var i=curYear; i>=curYear-25; i--){
    years.push(i)
  }

  const handleChangeMonth = (e)=>{
    setSelectedMonth(e.target.value)
  }
  const prev = ()=>{
    let low = (page-1)*5
    let up = (page)*5>count?count: (page)*5
    if(page>0){
      setPage(page-1);
      setCurBills(bills.slice(low,up))
    }
  }
  const next = ()=>{
      let up = (page+2)*5>count?count: (page+2)*5
      let low = (page+1)*5
      if(up>low){
        setPage(page+1)
        setCurBills(bills.slice(low,up))
      }
  }
  const handleChangeYear = (e)=>{
    setSelectedYear(e.target.value)
  }
  const handleChangeMonth1 = (e)=>{
    setSelectedMonth1(e.target.value)
  }
  const handleChangeYear1 = (e)=>{
    setSelectedYear1(e.target.value)
  }

  const handleFormSubmittion = async (e)=> {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("month", selectedMonth);
    formData.append("year", selectedYear);
    console.log("formData", formData)
    try {
      // const res = await axios.post('/api/upload', formData);
      const res = await axios.post('http://65.2.188.171:5000/api/upload', formData);
      console.log("res is ", res)
    }
    catch(err){
      console.log("error is ",err)
    }
    await fetchBills();
    return Notify("Bill uploaded successfully");
  }

  function handleFileTitle (e) {
    setFileTitle(e.target.value);
  }

  function handleUploadedFile (e) {
    setUploadedFile(e.target.files[0]);
  }

  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const bytes = atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'image/jpeg' });
  };

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
      if (data.success) {
        setPrivateMessage(data.data);
        return Notify("You can view monthly bills here");
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

  const fetchBills = async () => {
    try{
      const formData = new FormData();
      formData.append("month", selectedMonth1);
      formData.append("year", selectedYear1);
      const res = await axios.post('http://65.2.188.171:5000/api/upload/bills', formData);
      if(res.data && res.data.success){
        setBills(res.data.bills)
        setCount(res.data.bills.length)
        setPage(0)
      }
    } catch (err){
      return Notify("Error in fetching bills", "error");
    }
  }

  const handleOpenFile = async (key) => {
    try{
      const formData = new FormData()
      formData.append("key", key)
      const res = await axios.post('http://65.2.188.171:5000/api/upload/download', formData);
      if(res.data && res.data.success){
        if(res.data.type[0]==="pdf"){
          navigate("/pdfviewer", {state: {data : "data:application/pdf;base64," + res.data.file, type: "pdf"}})
        } else {
            navigate("/imageviewer", {state: {data: res.data.file, type: "image"}})
            // const blob = base64toBlob(res.data.file);
            // const url = URL.createObjectURL(blob);
            // setFileToOpen([url])
            // setIsViewerOpen(true)
        }
      }
    } catch(err) {
      return Notify("Error in downloading the bill", "error")
    }
  }

  const deleteBill = async (key) => {
    try{
      const formData = new FormData()
      formData.append("key", key)
      formData.append("month", selectedMonth1)
      formData.append("year", selectedYear1)
      const res = await axios.post('http://65.2.188.171:5000/api/upload/delete', formData);
      if(res.data && res.data.success){
          Notify("Successfully deleted the bill")
          await fetchBills();
        } else {
          Notify("Could not delete the bill", "error")
            // const blob = base64toBlob(res.data.file);
            // const url = URL.createObjectURL(blob);
            // setFileToOpen([url])
            // setIsViewerOpen(true)
        }
    } catch(err) {
      return Notify("Error in downloading the bill", "error")
    }
  }

  const toggleOpenFileUpload = (e) => { 
    e.preventDefault()
    if(!openFileUpload)
    setOpenFileUpload(!openFileUpload)
  }

  useEffect(() => {
    fetchBills();
  }, [selectedMonth1, selectedYear1]);

  useEffect(() => {
    fetchPrivateDate();
  }, [])

  useEffect(() =>{
    let up = 5>count?count: 5
    if(count===0){
      setCurBills([])
    }
    else{
      setCurBills(bills.slice(0,up))
    }
  },[bills])

  const closeImageViewer = () => {
    setFileToOpen([])
    setIsViewerOpen(false)
  };
  console.log(selectedMonth1, bills, curBills)
  return (
    <div style={{width:"100%", overflowY: "scroll", overflowX: "hidden", marginTop: "3%"}}>
      {auth.role && auth.role==="admin" ?<div style={{border: "solid black 2px", padding: "5px", maxWidth: "100%",position: "relative", color: "#873e23"}} className='heading'>
       <div>
        {
          openFileUpload ? <h1 style={{position: "absolute", left:"45%", fontSize: "1.5vw"}}>
          Upload Bills
        </h1>: 
        <button style={{border:"none", width: "100%", "height": "100%"}} onClick={toggleOpenFileUpload}><h1 style={{position: "absolute", left:"40%", fontSize: "1.5vw"}}>
        Click here to upload bills
      </h1> </button>
        }
      </div>
      <br />
      <br />
      { openFileUpload ? 
      <div style={{display: "flex", justifyContent: "center", width: "99%", overflowX:"scroll"}}>
      <form
        encType="multipart/form-data"
        onSubmit={handleFormSubmittion}
        id="form"
      >
        <input
          type="file"
          onChange={handleUploadedFile}
          required
          style={{position: "absolute", left:"43%"}}
          accept="image/png, image/jpg, image/gif, image/jpeg, application/pdf"
        /> 
        <br />
        <br />
        <div style={{display: "flex", position:"absolute", left: "40%"}} className='selector'>
          <label>Month: </label> 
          <select style={{marginLeft: "5%"}} value={selectedMonth} onChange={handleChangeMonth}>
            {months.map((option) => (
            
              <option value={option}>{option}</option>
            
            ))}
          </select>
          <label style={{marginLeft: "40px"}}>Year: </label>
          <select style={{marginLeft: "5%"}} value={selectedYear} onChange={handleChangeYear}>
            {years.map((option) => (
            
              <option value={option}>{option}</option>
            
            ))}
          </select>
        </div>
        <br />
        <br />

        <button style={{marginBottom: "10px"}} type="submit">Upload Bill</button>
      </form>
      </div> : null
      }
      </div> : null}
      <div style={{overflowX: "scroll", color: "#873e23", marginTop: "60px"}} className='heading'>
        <h2 style={{fontSize: "1.5vw", marginTop:"2%", marginLeft: "45%"}}>View Bills</h2>
        <div style={{display: "flex", marginLeft: "40%"}} className='selector'>
          <label>Month: </label> 
          <select value={selectedMonth1} onChange={handleChangeMonth1}>
            {months.map((option) => (
            
              <option value={option}>{option}</option>
            
            ))}
          </select>
          <label style={{marginLeft: "100px"}}>Year: </label>
          <select value={selectedYear1} onChange={handleChangeYear1}>
            {years.map((option) => (
            
              <option value={option}>{option}</option>
            
            ))}
          </select>
        </div>
        {/* <div style={{margin: "20px", width: "98%", height: "600px", overflowY: "scroll", border: "solid black 2px"}}>
        <ul>
          {bills.map(item => (
            <li key={item} style={{display: "flex"}}>
            <Card style={{width: "90%", overflowX: "hidden", margin: "10px", height: "40px", padding: "0px", backgroundColor: "#604B4E", color:"white"}}>
            <button onClick={()=>{handleOpenFile(item);}} style={{border: "none", height: "100%", padding: "0px", backgroundColor: "#604B4E", color: "white", fontSize:"1.5vw"}}>{item}</button>
            </Card>
            <input
              type="image"
              src={IMAGES.green_check}
              style={{width: "20px", height: "20px", margin: "20px"}}
              alt="Back"
            />
            </li>
          ))}
        </ul>
        </div> */}
        <table style={{marginLeft: "35%", height: "400px"}}>
          <thead>
            <tr>
              <th style={{padding:"15px", border: "solid black 2px", width: "40px"}}>{}</th>
              <th style={{padding:"15px", border: "solid black 2px", width: "450px"}}>File Name</th>
              <th style={{padding:"15px", border: "solid black 2px", width: "100px"}}>Link</th>
              {auth.role==="admin" ? <th style={{padding:"15px", border: "solid black 2px", width: "60px"}}>Delete</th>: null}
            </tr>
          </thead>
          <tbody>
            {curBills.map((bill, index) => {
              return (
                <tr>
                  <td style={{padding:"15px", border: "solid black 2px"}}>{index+page*5}</td>
                  <td style={{padding:"15px", border: "solid black 2px"}}>{bill}</td>
                  <td style={{padding:"15px", border: "solid black 2px"}}><button onClick={()=>{handleOpenFile(bill);}} style={{border: "none", height: "100%", padding: "0px", background: "none", color: "blue"}}>Open</button></td>
                  {auth.role==="admin" ?<td style={{padding:"15px", border: "solid black 2px"}}> <input onClick={()=>{deleteBill(bill)}} type="image" src={IMAGES.deleteIcon} style={{width: "15px", height: "15px"}} alt="delete"/></td>: null}
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
        onClick={prev} className="prev-button" style={{marginLeft:"35%", width: "70px"}}
      >
        previous
      </button>
      <button
        onClick={next} style={{marginLeft:"2px", width: "70px"}}
      >
        next
      </button>
      Page: {page+1} out of {count%5===0 ? count/5 : parseInt(count/5)+1}
      </div> 
      {/* {fileToOpen ? 
       <PdfViewer data={fileToOpen}/>: null  
    } */}
    </div>
  )
};

export default BillsPage;
