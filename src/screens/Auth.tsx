import { useEffect } from "react";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { toggleLogin } from "../counterSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const KAKAO_LOGIN_MUTATION = gql`
  mutation Mutation($username: String!, $avatar: String!, $email: String) {
    kakaoLogin(username: $username, avatar: $avatar, email: $email) {
      ok
      error
      token
    }
  }
`;

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCompleted = (data: any) => {
    const {
      kakaoLogin: { ok, error, token },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      logUserIn(token);
      dispatch(toggleLogin());

      navigate("/");
      window.location.reload();
    }
  };

  const [kakaoLogin] = useMutation(KAKAO_LOGIN_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams;
    const code = params.get("code");
    const grantType = "authorization_code";
    const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
    axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;",
          },
        }
      )
      .then((res: any) => {
        const { access_token: ACCESS_TOKEN } = res.data;
        axios
          .get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          })
          .then((res: any) => {
            const {
              kakao_account: { email },
            } = res.data;
            const {
              kakao_account: {
                profile: { nickname, profile_image_url },
              },
            } = res.data;
            kakaoLogin({
              variables: {
                username: nickname,
                email,
                avatar: profile_image_url,
              },
            });
          });
      })
      .catch((Error: any) => {
        console.log(Error);
      });
  });

  return <></>;
};

export default Auth;
