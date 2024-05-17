import React, { useState, useEffect, useCallback } from "react";

const ChallengeSolver = () => {
  const [firstChallenge, setFirstChallenge] = useState(null);
  const [secondChallenge, setSecondChallenge] = useState(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const email = "your_email@example.com";

  useEffect(() => {
    // Step 1: Make a GET request to get the 1st challenge
    setFirstLoading(true);
    fetch(`${email}`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setFirstChallenge(JSON.parse(data));
        // Step 2: Solve the challenge
        // const solution = solveTask(data.task, data.data);
        // setSolution(JSON.stringify(solution));
      })
      .catch((error) => console.error("Error fetching challenge:", error))
      .finally(() => {
        setFirstLoading(false);
      });
  }, []);

  useEffect(() => {
    // Step 2: Make a GET request to get the 2st challenge
    if (firstChallenge?.encrypted_path) {
      setSecondLoading(true);
      fetch(firstChallenge.encrypted_path)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          setSecondChallenge(JSON.parse(data));
          // Step 2: Solve the challenge
          // const solution = solveTask(data.task, data.data);
          // setSolution(JSON.stringify(solution));
        })
        .catch((error) => console.error("Error fetching challenge:", error))
        .finally(() => {
          setSecondLoading(false);
        });
    }
  }, [firstChallenge]);

  useEffect(() => {
    const res = solveTask();
    setResult(res);
  }, [secondChallenge]);

  const solveTask = useCallback(() => {
    if (secondChallenge?.encrypted_path.startsWith("task_")) {
      if (!secondChallenge?.encryption_method.includes("base64")) {
        // Extract ASCII values from task string
        const asciiValues = JSON.parse(
          secondChallenge?.encrypted_path.slice(5)
        );
        // Convert ASCII values to string
        const jsonString = asciiValues
          .map((val) => String.fromCharCode(val))
          .join("");
        // Parse the JSON string to get the JSON array
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.error("Error parsing JSON string:", error);
          return null;
        }
      } else {
        const base64String = secondChallenge?.encrypted_path.slice(5);
        // Decode Base64 string
        const decodedString = atob(base64String);
        return decodedString;
      }
    } else {
      console.error("Unknown task type:", secondChallenge?.encrypted_path);
      return null;
    }
  }, [secondChallenge]);

  return (
    <div className="main-container">
      <h1>Challenge Solver</h1>
      <div>
        <h5>
          First Task: {!firstLoading ? firstChallenge?.hint : "Loading..."}
        </h5>
        <h5>
          Second Task:{" "}
          {!secondLoading ? JSON.stringify(secondChallenge) : "Loading..."}
        </h5>
      </div>
      {result ? (
        <div>
          <h5>Final Result: {result}</h5>
        </div>
      ) : null}
    </div>
  );
};

export default ChallengeSolver;
