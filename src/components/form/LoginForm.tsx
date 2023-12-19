import { styled } from "styled-components";
import { motion } from "framer-motion";
import { faComment, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toggleLogin } from "../../counterSlice";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../../apollo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const LoginBox = styled.div`
  width: 600px;
  height: 650px;
  border-radius: 7px;
  background-color: white;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const LoginBoxHeader = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    margin: 0 23px;
    font-size: 22px;
    color: rgba(0, 0, 0, 0.8);
    &:first-child {
      font-family: "Times New Roman", Times, serif;
      letter-spacing: 1px;
    }
    &:last-child {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const LoginBoxContent = styled.div`
  width: 520px;
  height: 610px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-left: 80px;
`;

const Div = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  span {
    &:first-child {
      font-size: 24px;
      font-weight: 600;
      color: black;
    }
    &:last-child {
      font-size: 23px;
      margin-top: 15px;
      color: #69d802;
      font-weight: 600;
    }
  }
`;

const Form = styled.form`
  width: 100%;
  height: 440px;
`;

const Input = styled.input<{ isvalid: string }>`
  width: 440px;
  height: 50px;
  border-radius: 20px;
  margin: 10px 0;
  border: 1px solid
    ${({ isvalid }) =>
      isvalid === "true"
        ? "rgba(21, 83, 177, 0.2)"
        : "rgba(211, 44, 44, 0.61)"};
  outline: none;
  text-indent: 15px;
  font-size: 15px;
  &:focus {
    border: 3px solid
      ${({ isvalid }) =>
        isvalid === "true"
          ? "rgba(21, 83, 177, 0.2)"
          : "rgba(211, 44, 44, 0.61)"};
  }
`;

const Button = styled.button`
  width: 440px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
  cursor: pointer;
  border: none;
  background-color: #69d802;
  color: white;
`;

const KaKaoDiv = styled.div`
  width: 440px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
  cursor: pointer;
  border: none;
  color: black;
  background-color: yellow;
`;

const ErrorMsg = styled.span`
  color: #df4d4d;
  font-size: 15px;
  font-weight: 600;
`;

export const overlayVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

interface FormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onCompleted = (data: any) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      setErrorMsg(error);
    } else {
      logUserIn(token);
      dispatch(toggleLogin());
      navigate("/");
      window.location.reload();
    }
  };
  const [login, loading] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = () => {
    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };

  const rest_api_key = process.env.REACT_APP_REST_API_KEY;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const onKakaoClicked = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Overlay
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LoginBox>
        <LoginBoxHeader>
          <span>LOGIN</span>
          <span onClick={() => dispatch(toggleLogin())}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </LoginBoxHeader>
        <LoginBoxContent>
          <Div>
            <span>테니스가 치고 싶을 땐</span>
            <span>GOGOTENNIS</span>
          </Div>
          <Form onSubmit={handleSubmit(onSubmitValid)}>
            <Div>
              <Input
                isvalid={!errors?.username ? "true" : "false"}
                {...register("username", { required: true })}
                type="text"
                name="username"
                placeholder="유저네임을 입력해주세요"
              ></Input>
              <Input
                {...register("password", {
                  required: true,
                })}
                autoComplete="off"
                name="password"
                isvalid={!errors?.password ? "true" : "false"}
                type="password"
                placeholder="비밀번호를 입력해주세요"
              ></Input>
            </Div>
            <ErrorMsg>{errorMsg}</ErrorMsg>
            <Div>
              <Button
                disabled={loading.loading ? true : false}
                style={{ opacity: loading.loading ? "0.5" : "1" }}
              >
                로그인
              </Button>
              <KaKaoDiv onClick={onKakaoClicked}>
                <FontAwesomeIcon
                  icon={faComment}
                  style={{ fontSize: "27px", marginRight: "12px" }}
                />
                카카오 로그인
              </KaKaoDiv>
            </Div>
          </Form>
        </LoginBoxContent>
      </LoginBox>
    </Overlay>
  );
};

export default LoginForm;
