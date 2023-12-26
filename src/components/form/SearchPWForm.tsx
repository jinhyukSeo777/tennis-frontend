import { styled } from "styled-components";
import { motion } from "framer-motion";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toggleSearchPW } from "../../counterSlice";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { gql, useMutation } from "@apollo/client";

const SEARCH_PW_MUTATION = gql`
  mutation createRandomPW($username: String!, $email: String!) {
    createRandomPW(username: $username, email: $email) {
      ok
      error
      password
    }
  }
`;

const Overlay = styled(motion.div)`
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

const LoginBox = styled.div`
  width: 600px;
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
  width: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-left: 80px;
`;

const Form = styled.form`
  width: 100%;
`;

const Input = styled.input<{ isvalid: string }>`
  width: 440px;
  height: 50px;
  margin: 30px 0 0 0;
  border-radius: 20px;
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
  margin: 30px 0 30px 0;
  cursor: pointer;
  border: none;
  background-color: #69d802;
  color: white;
`;

const ErrorMsg = styled.span`
  display: block;
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
  email: string;
  username: string;
}

const SearchPWForm = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onCompleted = (data: any) => {
    const {
      createRandomPW: { ok, error, password },
    } = data;
    if (!ok) {
      setErrorMsg(error);
    } else {
      const { email } = getValues();
      const obj = {
        password,
        email,
      };
      emailjs
        .send(
          process.env.REACT_APP_SERVICE_ID || "",
          process.env.REACT_APP_PW_TEMPLATE_ID || "",
          obj,
          process.env.REACT_APP_API_PUBLIC_KEY || ""
        )
        .then(
          (result) => {
            alert("성공적으로 이메일이 전송되었습니다.");
            dispatch(toggleSearchPW());
          },
          (error) => {
            setErrorMsg(error.text);
            alert("이메일이 전송이 실패되었습니다.");
          }
        );
    }
  };

  const [createRandomPW, loading] = useMutation(SEARCH_PW_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = () => {
    const { username, email } = getValues();
    createRandomPW({
      variables: {
        username,
        email,
      },
    });
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
          <span>PW</span>
          <span onClick={() => dispatch(toggleSearchPW())}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </LoginBoxHeader>
        <LoginBoxContent>
          <Form onSubmit={handleSubmit(onSubmitValid)}>
            <Input
              isvalid={!errors?.username ? "true" : "false"}
              {...register("username", { required: true })}
              type="text"
              name="username"
              placeholder="유저네임 입력해주세요"
            ></Input>
            <Input
              isvalid={!errors?.email ? "true" : "false"}
              {...register("email", { required: true })}
              type="email"
              name="email"
              placeholder="가입하신 이메일을 입력해주세요"
            ></Input>
            <ErrorMsg>{errorMsg}</ErrorMsg>
            <Button
              disabled={loading.loading ? true : false}
              style={{ opacity: loading.loading ? "0.5" : "1" }}
            >
              이메일 보내기
            </Button>
          </Form>
        </LoginBoxContent>
      </LoginBox>
    </Overlay>
  );
};

export default SearchPWForm;
