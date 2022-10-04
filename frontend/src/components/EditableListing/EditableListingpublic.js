import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import Chip from "@material-ui/core/Chip";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import swal from "sweetalert";
import { AuthContext } from "../../App";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

const defaultListing = {
  id: "123456",
  title: "Intitulé du poste",
  description:"",
  jobType: "Temps plein",
  maxApps: 20,
  numApps: 4,
  maxPos: 10,
  numAccepted: 1,
  postingDate: 1611146620579,
  deadlineDate: 1611146620579,
  requiredSkills: ["Python", "Data Science", "Javascript"],
  duration: 3,
  salary: 5000,
  numRatings: 4,
  ratingSum: 17,
  recruiter: {
    id: "1234556",
    name: "XYZ Recruteurs",
    email: "xyzrecruiters@recruiter.com",
  },
};

const dt = (x) => {
  let a = new Date(x);
  return a.toLocaleString();
};

function EditableListingpublic(props) {
  const [editing, setEditing] = useState(false);
  const [listing, setListing] = useState(
    props.listing ? props.listing : defaultListing
  );

  const getDate = (d) => {
    let dt = new Date(d);
    return dt;
  };

  const handleDateChange = (newDate) => {
    setListing({
      ...listing,
      deadlineDate: newDate,
    });
  };

  const onChangeHandler = (e) => {
    setListing({
      ...listing,
      [e.target.name]: e.target.value,
    });
  };

  const deleteListing = () => {
    let url = `/api/listing/${listing._id}`;
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    axios
      .delete(url, config)
      .then((response) => {
        swal("Listing deleted successfully", "", "success").then(() =>
          location.reload()
        );
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            if (error.response.data.msg) {
              swal("Error", error.response.data.msg, "error");
            }
          }
        } else {
          console.log(error);
          swal("Error", "Something went wrong", "error");
        }
      });
  };

  const updateListing = () => {
    let url = `/api/listing/${listing._id}`;
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    let data = {
      maxApps: listing.maxApps,
      maxPos: listing.maxPos,
      deadlineDate: listing.deadlineDate,
    };
    axios
      .put(url, data, config)
      .then((response) => {
        swal("Listing updated successfully", "", "success");
        setEditing(false);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            if (error.response.data.msg) {
              swal("Error", error.response.data.msg, "error");
            } else if (error.response.data.errors) {
              swal("Error", error.response.data.errors.join("<br/>"), "error");
            }
          }
        } else {
          console.log(error);
          swal("Error", "Something went wrong", "error");
        }
      });
  };

  const validateForm = () => {
    if (Number(listing.maxPos) === NaN || Number(listing.maxApps) === NaN) {
      return swal("Error", "Please enter NUMBERS", "error");
    }
    if (Number(listing.maxPos) <= 0 || Number(listing.maxApps) <= 0)
      return swal("Error", "Value greater than 0 required", "error");
    if (Number(listing.maxPos) > Number(listing.maxApps)) {
      return swal(
        "Error",
        "Positions can't be more than allowed applications",
        "error"
      );
    }
    if (listing.deadlineDate < Date.now())
      return swal("Error", "Deadline must be in future", "error");
    updateListing();
  };

  const editables = () => {
    if (editing) {
      return (
         
        <>
          <Typography style={{ marginBottom: -5 }} color="textSecondary">
            Date limite: {dt(listing.deadlineDate)}{" "}
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: -5 }}>
           Candidatures max.: {listing.maxApps}
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: 5 }}>
            Nombre de positions: {listing.maxPos}
          </Typography>
          <Link component={RouterLink} to={`applications/${listing._id}`}>
          </Link>
        </>
      );
    }
  };

  return (
    <Card style={{ marginBottom: 60 }}>
      <CardContent>
        <div>
          <Typography variant="h4" color="textPrimary" display="inline">
            {listing.title}
          </Typography>
          <Rating
            readOnly
            value={listing.ratingSum / listing.numRatings}
            style={{ float: "right" }}
          />
        </div>
        <Typography style={{ marginBottom: -5 }} color="textSecondary">
          Posté par :{" "}
          <span style={{ color: "#800080", fontSize: "1.1rem" }}>
            {listing.recruiter.name}{" "}
          </span>
        </Typography>
        <Typography style={{ marginBottom: -5 }} color="textSecondary">
          Date de publication: {dt(listing.postingDate)}{" "}
        </Typography>
        <Typography color="textPrimary" style={{ marginBottom: -5 }}>
          {listing.jobType}
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: -5 }}>
          Durée:{" "}
          {listing.duration === 0 ? "Indéfinie" : `${listing.duration} mois`}
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: -5 }}>
          Positions restantes: {listing.maxPos - listing.numAccepted}
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: 5 }}>
        Candidature max. : {listing.numApps}
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: 5 }}>
        Descrption du poste: {listing.description}
        </Typography>
        <Typography
          variant="h4"
          style={{ color: "lightgreen", marginBottom: 0 }}
        >
          {listing.salary} Ar.
        </Typography>
        {editables()}
      </CardContent>
    </Card>
  );
}

export default EditableListingpublic;
