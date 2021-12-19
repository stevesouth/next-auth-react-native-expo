import React, { useEffect } from "react";
import { View, Button } from "react-native";
import * as Google from "@stevesouth/expo-auth-session/providers/google";
import { useAutoDiscovery } from "@stevesouth/expo-auth-session";

const EXPO_CLIENT_ID = "<repalce with expo client id>";

export default function LoginGoogle({
  challenge,
  state,
  codeCallback = () => {},
}) {
  const discovery = useAutoDiscovery("https://accounts.google.com");
  const tokenEndpoint = discovery
    ? discovery.discoveryDocument.token_endpoint
    : null;

  console.log("token endpoint", tokenEndpoint);
  console.log("render challenge: ", challenge.challenge);
  console.log("render verifier: ", challenge.verifier);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    shouldAutoExchangeCode: false,
    responseType: "code",
    codeChallengeMethod: "S256",
    codeChallenge: challenge.challenge, // This will be overridden without https://github.com/expo/expo/pull/15535
    codeVerifier: "unknown", // not needed, only the server should know this
    state,
    usePKCE: true,
    scope: ["openid"],
  });

  console.log(request);
  console.log("verifier", request && request.codeVerifier);

  useEffect(async () => {
    if (response?.type === "success") {
      console.log("response", response);
      console.log("BACK FROM GOOGLE", response);
      console.log("CODE RESPONSE", response.params.code);
      codeCallback(response.params.code);
    }
  }, [response]);
  return (
    <View
      style={{
        paddingTop: 200,
      }}
    >
      <Button
        disabled={!request}
        title="Login Google"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}
