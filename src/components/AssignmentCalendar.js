import React, { useEffect, useState } from "react";
import { Grid, Typography, makeStyles, Button, Modal } from "@material-ui/core";
import { monthData } from "./calendarTest/data";
import { firestore } from "../firebase";

const useStyles = makeStyles(() => ({
  items: {
    marginTop: 40,
    border: "1px solid #eee",
  },
  calendar: {
    marginTop: 20,
    paddingRight: 10,
  },
  reminders: {
    marginTop: 40,
    marginLeft: 20,
    width: "80%",
  },
  title: {
    textDecoration: "underline",
    marginBottom: 10,
  },
  event: {
    marginBottom: 5,
    padding: 5,
    borderRadius: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    position: "absolute",
    width: 400,
    backgroundColor: "#fff",
    border: "2px solid #000",
    padding: 20,
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
  },
}));

const mockData = {
  days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export default function AssignmentCalendar() {
  const classes = useStyles();
  const [display, setDisplay] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignmentId, setAssignmentId] = useState("");
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
          console.log(doc.id, " => ", doc.data());
        });
        setAssignments(data);
      });
  }, []);

  function handleEventModalOpen(event, id) {
    event.preventDefault();
    setAssignmentId(id);
    setModalOpen(true);
  }

  function handleEventModalClose() {
    setAssignmentId("");
    setModalOpen(false);
  }

  function compareEvents(a, b) {
    // Use toUpperCase() to ignore character casing
    const eventA = parseInt(a.dueTime.substring(0, 2));
    const eventB = parseInt(b.dueTime.substring(0, 2));

    let comparison = 0;
    if (eventA > eventB) {
      comparison = 1;
    } else if (eventA < eventB) {
      comparison = -1;
    }
    return comparison;
  }
  return (
    <Grid
      container
      direction='row'
      justify='start'
      style={{ backgroundColor: "#fff" }}
    >
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 20,
          marginRight: 20,
        }}
      >
        <Button
          variant='contained'
          onClick={() => setDisplay((prevState) => !prevState)}
        >
          {display ? "Side by Side" : "Full Screen"}
        </Button>
      </Grid>
      {!display ? (
        <Grid item xs={3}>
          <Grid container className={classes.reminders} direction='column'>
            <Typography variant='h4' className={classes.title}>
              REMINDERS
            </Typography>
            {assignments
              .filter((eventItem) => eventItem.reminder)
              .map((item) => (
                <ul>
                  {item.title}: {item.reminder}
                </ul>
              ))}
          </Grid>
        </Grid>
      ) : null}
      <Grid item xs={display ? 12 : 9} className={classes.calendar}>
        <Grid container>
          <Grid item xs={12} align='center'>
            <Typography variant='h4' className={classes.title}>
              CALENDAR
            </Typography>
          </Grid>
          {monthData.map((dayMonth) => (
            <Grid item xs={2} className={classes.items}>
              <Grid container direction='column' justify='center'>
                <Grid item style={{ textAlign: "center" }}>
                  <Typography variant='body'>
                    {mockData.days[dayMonth.dow]}
                  </Typography>
                  <Typography variant='h6'>{dayMonth.day}</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 5, marginTop: 10 }}>
                  <Grid container>
                    {assignments
                      .filter(
                        (assignItem) =>
                          assignItem.dueDate &&
                          assignItem.dueDate.day === dayMonth.day
                      )
                      .sort(compareEvents)
                      .map((item) => (
                        <>
                          <Grid
                            item
                            // xs={12}
                            style={{
                              backgroundColor: item.color
                                ? item.color
                                : "green",
                              minWidth: 75,
                            }}
                            className={classes.event}
                            onClick={(event) =>
                              handleEventModalOpen(event, item.id)
                            }
                          >
                            <Typography style={{ fontSize: 12 }}>
                              {item.title}
                            </Typography>
                            <Typography style={{ fontSize: 12 }}>
                              {item.dueTime}
                            </Typography>
                          </Grid>
                          {modalOpen && item.id === assignmentId ? (
                            <Modal
                              open={modalOpen}
                              onClose={handleEventModalClose}
                              className={classes.modal}
                              // style={{ backgroundColor: item.color }}
                            >
                              <Grid
                                direction='column'
                                className={classes.modalContent}
                              >
                                <Grid item>
                                  <Typography variant='h3'>
                                    {item.title}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant='h6'>
                                    Date: {item.dueDate.month}/
                                    {item.dueDate.day}/{item.dueDate.year}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant='h6'>
                                    Time: {item.dueTime}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant='h6'>
                                    Time: {item.category}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography>{item.description}</Typography>
                                </Grid>
                              </Grid>
                            </Modal>
                          ) : null}
                        </>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}