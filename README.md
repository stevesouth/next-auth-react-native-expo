# next-auth-react-native-expo

Both next auth and expo have PRs open to support this example flow.

Clone both the repos next to this one.

git clone git@github.com:stevesouth/next-auth.git
git clone git@github.com:stevesouth/expo.git

The main expo library is expo-auth-session. To install the modified version.

Use node 14 / npm 7.

cd ../expo/
git checkout allow-manual-AuthRequest-codeChallenge
npm run setup:native

cd ../expo/packages/expo-auth-session
npm i && npm run build
npm link

You can now link the modified expo-auth-session locally.

cd ../../../next-auth-react-native-expo/demo-app
npm link expo-auth-session

To check you were on the correct branch and the build and linking has worked, ensure the check on line 209 in demo-app/node_modules/expo-auth-session/build/AuthRequest.js is:

if (this.codeChallenge) {
