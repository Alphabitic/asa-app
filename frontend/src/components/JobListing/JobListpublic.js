import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from "axios";
import swal from "sweetalert";
import { AuthContext } from "../../App";

const defaultListing = {
  id: "",
  title: "Titre",
  jobType: "Temps plein",
  maxApps: 10,
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
    name: "Recruteur",
    email: "zola_andriaoutlook.fr",
  },
  applied: false,
};

const dt = (x) => {
  let a = new Date(x);
  return a.toLocaleString();
};

function JobListpublic(props) {
  const [listing, setListing] = useState(
    props.listing ? props.listing : defaultListing
  );
  const [editing, setEditing] = useState(false);
  const [sop, setSop] = useState("");
  const { auth, setAuth } = React.useContext(AuthContext);

  const sopNumWords = () => {
    let words = sop.split(/\s+/);
    words.pop();
    return words.length;
  };

  const makeApplication = () => {
    if (sopNumWords() >= 250)
      return swal("Error", "SOP must be less than 250 words", "error");

    let url = "/api/application";
    let config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    let data = {
      listingId: listing._id,
      applicantId: auth.user._id,
      sop: sop,
    };
    axios
      .post(url, data, config)
      .then(() => {
        return swal("Application successfully made", "", "success").then(
          () => (window.location = "/")
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
          swal("Error", "Something went wrong", "error");
        }
      });
  };

  return (
    <>
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
            Post?? par:{" "}
            <span style={{ color: "#800080", fontSize: "1.1rem" }}>
              {listing.recruiter.name}{" "}
            </span>
          </Typography>
          <Typography color="textPrimary" style={{ marginBottom: -5 }}>
            {listing.jobType}
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: -5 }}>
            Dur??e:{" "}
            {listing.duration === 0
              ? "Ind??finie"
              : `${listing.duration} mois`}
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: 5 }}>
            Positions restantes: {listing.maxPos - listing.numAccepted}
          </Typography>
         </CardContent>
          </Card>
    </>
  );
}

export default JobListpublic;
