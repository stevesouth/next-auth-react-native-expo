import NextAuth from "@stevesouth/next-auth";
import GoogleProvider from "@stevesouth/next-auth/providers/google";

console.log("GOOGLE_ID", process.env.GOOGLE_ID);
console.log("GOOGLE_SECRET", process.env.GOOGLE_SECRET);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.SECRET,

  session: {
    strategy: "jwt",
  },

  debug: false,
});
