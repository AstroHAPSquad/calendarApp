import { React, useState, useEffect } from "react";
import {
  Typography,
  makeStyles,
  Grid,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";
import AssignmentCard from "./AssignmentCard";
import { firestore, auth } from "../firebase";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
    margin: 5,
  },
  button: {
    padding: 10,
    margin: 10,
    color: "green",
    alignSelf: "center",
  },
  input: {
    padding: 10,
    margin: 10,
    width: "50%",
  },
  grid: {
    marginTop: 20,
    paddingTop: 20,
  },
}));

export default function AssignmentList() {
  const classes = useStyles();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    firestore
      .collection("assignments")
      .get()
      .then(function (querySnapshot) {
        let data = [];
        querySnapshot.forEach(function (doc) {
          data.push({ id: doc.id, ...doc.data() });
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
        });
        setAssignments(data);
      });
  }, []);

  function compareAssignments(a, b) {
    const eventA = parseInt(a.dueDate.day);
    const eventB = parseInt(b.dueDate.day);

    let comparison = 0;
    if (eventA > eventB) {
      comparison = -1;
    } else if (eventA < eventB) {
      comparison = 1;
    }
    return comparison;
  }

  return (
    <div className={classes.root}>
      <Grid container align='left' alignItems='center'>
        {assignments &&
          assignments
            .filter(
              (id) => auth.currentUser && id.userID === auth.currentUser.uid
            )
            .sort(compareAssignments)
            .map((assign) => (
              <Grid item xs={4} style={{ padding: 35 }}>
                <AssignmentCard assignment={assign} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
}
