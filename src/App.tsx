import React, { useState } from "react";
import "./App.css";

interface Ant {
  name: string;
  length: number;
  color: "BLACK" | "RED" | "SILVER";
  weight: number;
  calcFunction: any;
  calcStatus?: "Not Yet Run" | "In Progress" | "Calculated" | any;
}

function App() {
  const [ants, setAnts] = useState<Ant[]>([]);
  const [globalRaceState, setGlobalRaceState] = useState<
    "Not Yet Run" | "In Progress" | "All Calculated"
  >("Not Yet Run");

  const fetchAntData = () => {
    fetch("ants.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnts(data.ants);
      });
  };

  function generateAntWinLikelihoodCalculator() {
    const delay = 7000 + Math.random() * 7000;
    const likelihoodOfAntWinning = Math.random();

    return (callback) => {
      setTimeout(() => {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }

  const runRace = () => {
    if (!ants.length) alert("Please fetch the ant data first!");

    const antsWithCalculation = ants.map((ant) => {
      return {
        ...ant,
        calcStatus: "Not Yet Run",
        calcFunction: generateAntWinLikelihoodCalculator(),
      };
    });

    setAnts(antsWithCalculation);

    antsWithCalculation.forEach((ant) => {
      ant.calcStatus = "In Progress";

      // A couple options here:
      // 1. find a way to OVERWRITE the `calcStatus` of the current ant in state (rather than appending it to the `ants` state array)
      // 2. REMOVE this ant from `ants` state array (should be 4 left now), create a NEW `ant` object with the updated property (`calcStatus`), and spread it into the state (which should only be 4 ants at this time)

      console.log(ant);

      setAnts([...antsWithCalculation, ant]);

      ant.calcFunction(async (likelihood) => {
        await new Promise((resolve, reject) => {
          resolve("race callback complete");
        });

        ant.calcStatus = "Calculated";

        setAnts([...antsWithCalculation, ant]);
      });
    });

    setGlobalRaceState("In Progress");
  };

  const setRaceStateStyle = () => {
    return globalRaceState === "Not Yet Run"
      ? styles.globalRaceState.notYetRun
      : globalRaceState === "In Progress"
      ? styles.globalRaceState.inProgress
      : styles.globalRaceState.allCalculated;
  };

  return (
    <div className="App">
      <h1>ANT RACE 🐜🏎</h1>

      <h2>Options</h2>
      <button onClick={fetchAntData}>Fetch Ant Data</button>
      <button onClick={runRace}>Run Race</button>

      <h2>Ant Contestants</h2>
      <h4>
        Global Race State:{" "}
        <span style={setRaceStateStyle()}>{globalRaceState}</span>
      </h4>
      {ants.length > 0 ? (
        <div>
          <ul style={styles.antWrapper}>
            {ants.map((ant) => {
              return (
                <li
                  className="antOutterWrapper"
                  style={styles.ant.wrapperOuter}
                >
                  <ul style={styles.ant.wrapperInner}>
                    <li style={styles.ant.label}>
                      <strong>Name: </strong>
                      {ant.name}
                    </li>
                    <li style={styles.ant.label}>
                      <strong>Length: </strong>
                      {ant.length}
                    </li>
                    <li style={styles.ant.label}>
                      <strong>Color: </strong>
                      {ant.color}
                    </li>
                    <li style={styles.ant.label}>
                      <strong>Weight: </strong>
                      {ant.weight}
                    </li>
                    <li style={styles.ant.label}>
                      <strong>Status: </strong>
                      {ant.calcStatus}
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div>No data yet. Please fetch some ants to begin a race.</div>
      )}
    </div>
  );
}

const styles = {
  antWrapper: {
    display: "flex",
  },
  ant: {
    wrapperOuter: {
      backgroundColor: "#333",
      color: "white",
      display: "flex",
      alignItems: "center",
      border: "1px solid black",
      borderRadius: "5px",
      flex: 1,
    },
    wrapperInner: {
      margin: "1rem",
    },
    label: {
      listStyle: "none",
      paddingBottom: "5px",
    },
  },
  globalRaceState: {
    notYetRun: {
      color: "grey",
    },
    inProgress: {
      color: "red",
    },
    allCalculated: {
      color: "green",
    },
  },
};

export default App;
