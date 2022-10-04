import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import "./MyListings.css";
import { AuthContext } from "../../App";
import EditableListingpublic from "../EditableListing/EditableListingpublic";





function MyListpublic() {
  const [listings, setListings] = useState([]);
  const { auth, setAuth } = React.useContext(AuthContext);
  useEffect(() => {
    let url = `/api/listing`;
    axios
      .get(url)
      .then((response) => {
        setListings(
          response.data.listings.filter((listing) => {
            return !listing.deleted && listing.numAccepted < listing.maxPos;
          })
        );
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <>

      <div className="MyListings ">
        <div className="Listings">
          <Typography variant="h1" gutterBottom>
          </Typography>
          {listings.map((listing) => (
            <EditableListingpublic key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyListpublic;
