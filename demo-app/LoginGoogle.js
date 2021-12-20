import React, { useEffect } from "react";
import { View, Button } from "react-native";
import * as Google from "@stevesouth/expo-auth-session/providers/google";
import { useAutoDiscovery } from "@stevesouth/expo-auth-session";

const GOOGLE_CLIENT_ID = "<enter your google oauth clien id>";

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

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID,
    shouldAutoExchangeCode: false,
    responseType: "code",
    codeChallengeMethod: "S256",
    codeChallenge: challenge.challenge, // This will be overridden without https://github.com/expo/expo/pull/15535
    codeVerifier: "unknown", // not needed, only the server should know this
    state,
    usePKCE: true,
    scope: ["openid"],
  });

  useEffect(async () => {
    if (response?.type === "success") {
      codeCallback(response.params);
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
