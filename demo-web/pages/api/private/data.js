import { getSession } from "@stevesouth/next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    res.send({
      content: "SUCCESS!! PRIVATE API DATA",
    });
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }
};
