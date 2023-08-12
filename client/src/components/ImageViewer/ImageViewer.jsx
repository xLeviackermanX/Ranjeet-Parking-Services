import React, {useState} from 'react'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {useLocation} from 'react-router-dom';
import { Button } from 'reactstrap';
import {
    Document,
    Page,
    Text,
    Image,
    PDFViewer,
    StyleSheet
  } from "@react-pdf/renderer";
const ImageViewer = () => {
    const location = useLocation();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const styles = StyleSheet.create({
        page: {
          backgroundColor: "white",
          color: "black",
        },
        section: {
          margin: 10,
          padding: 10,
        },
        viewer: {
          width: 0.5 * window.innerWidth, //the pdf viewer will take up all of the width and height
          height: 0.9 * window.innerHeight,
        },
      });
  // const onDocumentLoadSuccess = ({ numPages }) => {
	// 	setNumPages(numPages);
	// };
  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data;

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'image/jpeg' });
  };
    console.log(location)
    const blob = base64toBlob(location.state.data);
    const url = URL.createObjectURL(blob);
    return (
      <div style={{ height: '750px', display:"flex", justifyContent:"center" }}>
           <PDFViewer style={styles.viewer}>
           <Document>
            <Page>
            <Image src={url} />
            </Page>
            </Document>
           </PDFViewer>
      </div>
  )
}

export default ImageViewer