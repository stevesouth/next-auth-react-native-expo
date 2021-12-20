import "react-native-url-polyfill/auto";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import LoginGoogle from "./LoginGoogle";

const HOST = "<next auth app url>";
const GOOGLE = "/api/auth/signin/google";
const CSRF = "/api/auth/csrf";

export default function App() {
  const [log, setLog] = useState(null);
  const [params, setParams] = useState(null);

  const logger = {
    log: (arg1 = "", arg2 = "") => {
      console.log(`${arg1} ${arg2}`);
      setLog(`${arg1} : ${arg2}`);
    },
  };

  useEffect(async () => {
    try {
      logger.log(`\nStep 1: Fetching csrf from ${HOST + CSRF}`);

      const csrf = await fetch(HOST + CSRF)
        .then((response) => response.json())
        .catch((error) => logger.log("ERROR 1: ", error));

      logger.log("\nStep 2: Retrieved csrf", csrf.csrfToken);

      logger.log(
        "\nStep 3: Posting to signon to begin the signon process in order retreive code_challenge, redirect_uri and state. Including redirect:false in the body so that we get a response rather than next auth redirecting."
      );

      logger.log(`Endpoint: ${HOST + GOOGLE}`);

      fetch(HOST + GOOGLE, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csrfToken: csrf.csrfToken,
          redirect: false,
        }),
      })
        .then((response) => {
          logger.log("\nStep 4: signin reponse received");
          response
            .json()
            .then((val) => {
              logger.log("\nStep 5: signin reponse json parsed correctly");

              const params = new URLSearchParams(val.redirect);
              const codeChallenge = params.get("code_challenge");
              const redirectUri = params.get("redirect_uri");
              const state = params.get("state");

              logger.log("codeChallenge", codeChallenge);
              logger.log("redirectUri", redirectUri);
              logger.log("state", state);

              const paramState = {
                challengePair: {
                  challenge: codeChallenge,
                  verifier: null,
                },
                redirectUri,
                state,
              };

              logger.log(
                "\nStep 6: setting react state\n",
                JSON.stringify(paramState, null, 4)
              );

              setParams(paramState);
            })
            .catch((error) => logger.log("ERROR 2:", error));
        })
        .catch((error) => console.log("ERROR 3", error));
    } catch (error) {
      logger.log("ERROR 4", error);
    }
  }, []);

  const loginPage = params?.challengePair?.challenge ? (
    <LoginGoogle
      challenge={params.challengePair}
      codeCallback={async (responseParams) => {
        logger.log("\nStep 7: Received code callback: \n");
        logger.log(JSON.stringify(responseParams, null, 4));

        const callbackUrl = `${params.redirectUri}?code=${responseParams.code}&state=${params.state}&authuser=${responseParams.authuser}&scope=${responseParams.scope}&prompt=${responseParams.prompt}`;

        logger.log("\nStep 8: Sending code and state to the redirectUri\n");
        logger.log(callbackUrl);

        fetch(callbackUrl)
          .then((response) => console.log(response))
          .catch((error) => console.log("ERROR 4", error));
      }}
    ></LoginGoogle>
  ) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Demonstration of an oauth flow using modified NextAuth and react native
        expo
      </Text>
      <Text>{log}</Text>
      {loginPage}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 40,
  },
});
