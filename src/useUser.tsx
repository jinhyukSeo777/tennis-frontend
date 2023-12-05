import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "./apollo";

const MY_PROFILE_MUTATION = gql`
  query myProfile {
    myProfile {
      id
      username
      email
      summary
      avatar
      totalWin
      totalLose
      score
      Match {
        matchId
      }
    }
  }
`;

function useUser() {
  const token = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(MY_PROFILE_MUTATION, {
    skip: !token,
  });
  useEffect(() => {
    if (data?.myProfile === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}
export default useUser;
