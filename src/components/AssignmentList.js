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
    textAlign: "center",
    marginTop: 50,
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
  root: {
    marginTop: 20,
    margin: 5,
  },
}));

export default function AssignmentList() {
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

  return (
    <div>
      <Grid container>
        {assignments &&
          assignments
            .filter(
              (id) => auth.currentUser && id.userID === auth.currentUser.uid
            )
            .map((assign) => (
              <Grid item xs={4}>
                <AssignmentCard assignment={assign} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
}
