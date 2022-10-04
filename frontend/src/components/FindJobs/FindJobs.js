import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Slider from "@material-ui/core/Slider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import swal from "sweetalert";
import JobListing from "../JobListing/JobListing";
import "./FindJobs.css";
import { AuthContext } from "../../App";

const defaultFilters = {
  searchTerm: "",
  wfh: true,
  partTime: true,
  fullTime: true,
  salaryRange: [0, 100000000],
  maxDuration: 7,
  sortField: "salary",
  sortOrder: "descending",
};

function FindJobs() {
  const [filters, setFilters] = useState(defaultFilters);
  const [listings, setListings] = useState([]);
  const [maxSalary, setMaxSalary] = useState(10000);
  const { auth, setAuth } = React.useContext(AuthContext);

  const getRating = (listing) => {
    if (listing.numRatings === 0) return 0;
    else return listing.ratingSum / listing.numRatings;
  };

  useEffect(() => {
    setFilters({
      ...filters,
      salaryRange: [filters.salaryRange[0], maxSalary + 1000],
    });
  }, [maxSalary]);

  const fetchJobs = async function () {
    try {
      let allListings = await axios.get("/api/listing");
      allListings = allListings.data.listings;

      allListings = allListings.filter((listing) => {
        let d = new Date(listing.deadlineDate);
        return d.getTime() > Date.now() && !listing.deleted;
      });
      setMaxSalary(Math.max(...allListings.map((l) => l.salary), 0));

      let myApplications = await axios.get(
        `/api/application/byapplicant/${auth.user._id}`
      );
      let listingsAppliedTo = myApplications.data.applications.map(
        (application) => application.listingId
      );

      // Filters
      let filteredListings = allListings.filter((listing) => {
        return (
          listing.title
            .trim()
            .toLowerCase()
            .indexOf(filters.searchTerm.trim().toLowerCase()) !== -1 &&
          listing.salary <= filters.salaryRange[1] &&
          listing.salary >= filters.salaryRange[0] &&
          listing.duration < filters.maxDuration &&
          ((listing.jobType === "Full Time" && filters.fullTime) ||
            (listing.jobType === "Part Time" && filters.partTime) ||
            (listing.jobType === "WFH" && filters.wfh))
        );
      });

      //Applied to listings
      filteredListings = filteredListings.map((listing) => {
        if (listingsAppliedTo.indexOf(listing._id) !== -1)
          listing.applied = true;
        else listing.applied = false;
        return listing;
      });

      // Sorting
      if (filters.sortField === "rating") {
        if (filters.sortOrder === "ascending") {
          filteredListings.sort((a, b) =>
            getRating(a) < getRating(b) ? -1 : 1
          );
        } else {
          filteredListings.sort((a, b) =>
            getRating(a) > getRating(b) ? -1 : 1
          );
        }
      } else {
        if (filters.sortOrder === "ascending") {
          filteredListings.sort((a, b) =>
            a[filters.sortField] < b[filters.sortField] ? -1 : 1
          );
        } else {
          filteredListings.sort((a, b) =>
            a[filters.sortField] > b[filters.sortField] ? -1 : 1
          );
        }
      }

      setListings(filteredListings);
      console.log(filteredListings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(fetchJobs, []);

  const onFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const onCheckBoxChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked,
    });
  };

  const onSalaryRangeChange = (e, newValue) => {
    console.log(newValue);
    setFilters({
      ...filters,
      salaryRange: newValue,
    });
  };

  return (
    <>
      <Navbar />
      <div className="FindJobs">
        <div className="FilterPanel">
          <TextField
            fullWidth
            variant="outlined"
            name="searchTerm"
            placeholder="Rechercher"
            value={filters.searchTerm}
            onChange={onFilterChange}
          />
          <br />
          <br />
          <br />

          <h1>Filtre</h1>
          <FormControl component="fieldset">
            <Typography gutterBottom>Type</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.fullTime}
                    onChange={onCheckBoxChange}
                    name="fullTime"
                  />
                }
                label="Temps plein"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.partTime}
                    onChange={onCheckBoxChange}
                    name="temps"
                  />
                }
                label="Temps partiel"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.wfh}
                    onChange={onCheckBoxChange}
                    name="wfh"
                  />
                }
                label="Freelance"
              />
            </FormGroup>
          </FormControl>
          {/*
          <br />
          <br />
          <FormControl>
            <Typography gutterBottom>Salaire (par mois)</Typography>
            <br />

            <Slider
            style={{ minWidth: 200 }}
            value={filters.salaryRange}
            onChange={onSalaryRangeChange}
            name="salaryRange"
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={maxSalary + 1000}
            marks={[
              { value: 0, label: "0" },
              {
                value: (maxSalary + 1000) / 2,
                label: ((maxSalary + 1000) / 2).toString(),
              },
              {
                value: maxSalary + 1000,
                label: (maxSalary + 1000).toString(),
              },
            ]}
          />
          
          </FormControl>
        
          <br />
          <br />
          <FormControl>
            <Typography gutterBottom></Typography>
            <Select
              name="maxDuration"
              value={filters.maxDuration}
              onChange={onFilterChange}
            >
              {[...Array(7).keys()].map((i) => (
                <MenuItem value={i + 1} key={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            */}
          <br />

          <h1>Trier par</h1>
          <Select
            name="sortField"
            value={filters.sortField}
            onChange={onFilterChange}
          >
            <MenuItem value="salary">Salaire</MenuItem>
            <MenuItem value="duration">Durée</MenuItem>
            <MenuItem value="rating">Notes</MenuItem>
          </Select>
          <RadioGroup
            row
            value={filters.sortOrder}
            name="sortOrder"
            onChange={onFilterChange}
          >
            <FormControlLabel
              value="ascending"
              control={<Radio />}
              label="Ascendant"
            />
            <FormControlLabel
              value="descending"
              control={<Radio />}
              label="Descendant"
            />
          </RadioGroup>
          <br />
          <br />
          <br />
          <div className="BottomButtons">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={fetchJobs}
            >
              Rechercher
            </Button>
            <br />
          <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setFilters(defaultFilters)}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          style={{ position: "fixed", height: "100%" }}
        />
        <div className="Jobs">
          <Typography variant="h1" gutterBottom>

          </Typography>
          {listings.map((listing) => (
            <JobListing key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
}

export default FindJobs;
