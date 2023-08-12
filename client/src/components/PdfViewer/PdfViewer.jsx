import React, {useState, useCallback} from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import {useLocation} from 'react-router-dom';
import { Button } from 'reactstrap';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// const defaultLayoutPluginInstance = defaultLayoutPlugin();
// import {
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     PDFViewer,
//   } from "@react-pdf/renderer";
  // import { Document, Page } from 'react-pdf';
  // import { pdfjs } from 'react-pdf';
  // import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

  // const styles = StyleSheet.create({
  //   page: {
  //     backgroundColor: "white",
  //     color: "black",
  //   },
  //   section: {
  //     margin: 10,
  //     padding: 10,
  //   },
  //   viewer: {
  //     width: 0.5 * window.innerWidth, //the pdf viewer will take up all of the width and height
  //     height: 0.9 * window.innerHeight,
  //   },
  // });
  
 
const PdfViewer = () => {
    const location = useLocation();
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    // console.log(defaultLayoutPluginInstance)
  // const onDocumentLoadSuccess = ({ numPages }) => {
	// 	setNumPages(numPages);
	// };
  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };
    console.log(location)
    const blob = base64toBlob(location.state.data);
    const pdfUrl = URL.createObjectURL(blob);
    const PDFViewer = useCallback(({ url }) => {
        const defaultLayoutPluginInstance = defaultLayoutPlugin();
      return (
          //...skipped code
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div style={{ height: '750px', display: "flex", justifyContent: "center" }}>
           <Viewer
              fileUrl={url} plugins={[defaultLayoutPluginInstance]}
          />
      </div>
  </Worker>
      );
   }, [pdfUrl])
    return (
  //     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
  //     <div style={{ height: '750px', display: "flex", justifyContent: "center" }}>
  //          <Viewer
  //             fileUrl={url} plugins={[defaultLayoutPluginInstance]}
  //         />
  //     </div>
  // </Worker>
      <div><PDFViewer
      url={pdfUrl}/></div>
  )
}

export default PdfViewer