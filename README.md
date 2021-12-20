# next-auth-react-native-expo

Both next auth and expo have PRs open to support this example flow. I have pushed modified modules to the @stevesouth npm repo.

This is a proof of concept attempting to use react native expo auth, together with next auth. The flow very nearly works, but I think i've been scuppered at the final point.

Concept

1. Use next-auth as the backend for a react native mobile app
1. Keep oauth client secrets private to the server
1. Have expo auth do the oauth flow and request only a code
1. Have next-auth receive the code and do the code for token exchange

Issue

- This flow very nearly works. However at the last point, where next-auth is doing the token replacement google complains that the redirect uris do not match as they are different for step 3 (this is an expo url in development) and 4 (this is a next auth url).

I'm not quite sure why this exists in the oauth spec, as both uris are valid, hardcoded in the oauth configuration, and work perfectly well if used for both steps 3 and 4.

Setup

1. setup a google oauth credentials provider
1. enter you next auth location in demo-app/App.js
1. enter your google outh client id in demo-ap/LoginGoogle.js
1. create a SECRET, GOOGLE_ID, GOOGLE_SECRET environment variables in demo-web/.env.local
1. start the next auth app and the expo app

Note. To test this properly you should deply the next app to a public url. Vercel is the easiest way to do this.
